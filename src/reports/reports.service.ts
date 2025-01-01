import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { startOfDay, endOfDay, parseISO } from 'date-fns'; // Importa las funciones necesarias de date-fns
import { Category } from 'src/categories/entities/category.entity';
import { IncomeNames } from 'src/incomes/entities/income-names.enity';
import { Income } from 'src/incomes/entities/income.entity';
import { Entry } from 'src/products/entriy.entity';
import { ExpenseNames } from 'src/expenses/entities/expense-names.entity';
import { Expense } from 'src/expenses/entities/expense.entity';

@Injectable()
export class ReportsService {

  constructor(

    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>, //order details
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,//categoria
    @InjectRepository(IncomeNames) private readonly incomeNamesRepository: Repository<IncomeNames>, //income names
    @InjectRepository(Income) private readonly incomeRepository: Repository<Income>,  //Income
    @InjectRepository(Entry) private readonly entryRepository: Repository<Entry>,  //Income
    @InjectRepository(ExpenseNames) private readonly expenseNamesRepository: Repository<ExpenseNames>, //Income
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,  //Income

  ) { }
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  async findAll(startDate: string, endDate: string) {
    //console.log(`Fecha Inicio: ${startDate} Fecha Fin: ${endDate}`)
    // Establecer la fecha de inicio y final con la zona horaria correcta
    const startOfDayDate = startOfDay(parseISO(startDate)); // 00:00:00 de la fecha de inicio
    const endOfDayDate = endOfDay(parseISO(endDate));       // 23:59:59 de la fecha de fin
    const reports = []
    //array con todas las categorias
    const categoryNames = (await this.categoryRepository.createQueryBuilder('category')
      .select('category.name')
      .getRawMany()).map(row => row.category_name);

    // Array con todos los nombres de los ingresos
    const incomeNames = await this.incomeNamesRepository.createQueryBuilder('incomeName')
      .select('incomeName.name', 'name') // Selecciona el campo `name`
      .getRawMany()
      .then(rows => rows.map(row => row.name)); // Extrae cada `name` de los resultados

    //Array con todos los nombre de egresos
    const expenseNames = await this.expenseNamesRepository.createQueryBuilder('expenseName')
      .select('expenseName.name', 'name') // Selecciona el campo `name`
      .getRawMany()
      .then(rows => rows.map(row => row.name)); // Extrae cada `name` de los resultados

    //AÑADE AL REPORTE LAS VENTAS(INGRESO), Y LAS ENTRADAS DE PRODUCTOS(EGRESOS) 
    await Promise.all(
      categoryNames.map(async name => {
        const result = await this.reportSells(startDate, endDate, name);
        if (result && result.entities.length > 0) {
        //  console.log(result)
                   //  console.log(`Resultado = ${result}`); 

        // Extraer las sumas de totalPrice y totalPurchasePrice y formatearlas a dos decimales
        const income = parseFloat(result.raw
          .reduce((sum, current) => sum + parseFloat(current.totalPrice), 0)
          .toFixed(2));
        const categories = result.entities.map(orderDetail => orderDetail.product.category.name);
      
     
      
        const result1 = {
          name: categories[0],
          income: income,
          expense: 0,
          total: income

        }
        reports.push(result1)
        }
 

        const entries = await this.reportEntries(startOfDayDate, endOfDayDate, name);
       
        if (entries && entries.length > 0) {
          
          const existingEntry = reports.find(entry => entry.name === entries[0].categoryname);

          if (existingEntry) {
           
            existingEntry.expense = parseFloat((existingEntry.expense + parseFloat(entries[0].purchaseTotalPrice)).toFixed(2));
            existingEntry.total = parseFloat((existingEntry.income - existingEntry.expense).toFixed(2));
          
          } else {
            console.log("entra al else ........")
            const result1 = {
              name: entries[0].categoryname,
              income: 0,
              expense: entries[0].purchaseTotalPrice,
              total: -entries[0].purchaseTotalPrice

            }
            reports.push(result1)
          }
        }
      })
    );
    //AÑADE AL REPORTE LOS INGRESOS 
    await Promise.all(
      incomeNames.map(async name => {
        const resultIncome = await this.reportIncomes(startDate, endDate, name)
        if (resultIncome && resultIncome.length > 0) {
        
          
          const existingIncome = reports.find(entry => entry.name === resultIncome[0].incomename);
          const incomeName = resultIncome.map(income => income.incomename);
          const incomeTotal = resultIncome.map(income => parseFloat(income.amount).toFixed(2));
          if(existingIncome){
            existingIncome.income = parseFloat((existingIncome.income + parseFloat(incomeTotal[0])).toFixed(2));
            existingIncome.total = parseFloat((existingIncome.total + parseFloat(incomeTotal[0])).toFixed(2));
          }
          else{
           
            const result1 = {
              name: incomeName[0],
              income: incomeTotal[0],
              expense: 0,
              total: incomeTotal[0]
            }
            reports.push(result1)
          }
       
        }
       
      })
    );
    //AÑADE AL REPORTE LOS EGRESOS
    await Promise.all(
      expenseNames.map(async name => {
        const resultExpense = await this.reportExpense(startDate, endDate, name)
        if (resultExpense && resultExpense.length > 0){
          console.log(resultExpense)
          const existingExpense = reports.find(entry => entry.name === resultExpense[0].expensename);
          const expenseName = resultExpense.map(expense => expense.expensename);
          const expenseAmount = resultExpense.map(expense => expense.amount);
          if(existingExpense){
            existingExpense.expense = parseFloat((existingExpense.expense + parseFloat(expenseAmount[0])).toFixed(2));
            existingExpense.total = parseFloat((existingExpense.total - parseFloat(expenseAmount[0])).toFixed(2));
          }
          else{
            
          const result1 = {
            name: expenseName[0],
            income: 0,
            expense: expenseAmount[0],
            total: -expenseAmount[0]
          }
          reports.push(result1)
     
          }
       

        }
     
      })
    );
    const income = parseFloat(reports.reduce((sum, report) => sum + parseFloat(report.income), 0).toFixed(2));
    const expense = parseFloat(reports.reduce((sum, report) => sum + parseFloat(report.expense), 0).toFixed(2));
    const profit = parseFloat(reports.reduce((sum, report) => sum + parseFloat(report.total), 0).toFixed(2));


    //console.log(`Income: ${income}, Expense: ${expense}, Profit: ${profit}`);
    return {
      reports,
      income,
      expense,
      profit
    };

  }

  async reportIncomes(startDate: string, endDate: string, name: string) {


    const incomes = await this.incomeRepository.createQueryBuilder('income')
      .innerJoinAndSelect('income.incomeNames', 'incomeName')
      .select([
        'incomeName.name AS incomeName',  // Alias para el nombre de incomeName
      ])
      .addSelect('SUM(income.amount)', 'amount') // Sumar el monto
      .where('income.date >= :startDate', { startDate: startDate })
      .andWhere('income.date <= :endDate', { endDate: endDate })
      .andWhere('incomeName.name = :name', { name })
      .groupBy('incomeName.name') // Agrupar por el nombre del ingreso
      .getRawMany(); // Devuelve solo los resultados en bruto

    return incomes;

  }

  async reportExpense(startDate: string, endDate: string, name: string) {
    //console.log(`NOmbre para filtro: ${name}`)
    const expenses = await this.expenseRepository.createQueryBuilder('expense')
      .innerJoinAndSelect('expense.expenseNames', 'expenseName')
      .select([
        'expenseName.name AS expenseName',  // Alias para el nombre de incomeName
      ])
      .addSelect('SUM(expense.amount)', 'amount') // Sumar el monto
      .where('expense.date >= :startDate', { startDate: startDate })
      .andWhere('expense.date <= :endDate', { endDate: endDate })
      .andWhere('expenseName.name = :name', { name })
      .groupBy('expenseName.name') // Agrupar por el nombre del ingreso
      .getRawMany(); // Devuelve solo los resultados en bruto

   // console.log(expenses)
    return expenses;
  }

  async reportSells(startDate: string, endDate: string, name: string) {
    // Establecer la fecha de inicio y final con la zona horaria correcta
    const startOfDayDate = startOfDay(parseISO(startDate)); // 00:00:00 de la fecha de inicio
    const endOfDayDate = endOfDay(parseISO(endDate));       // 23:59:59 de la fecha de fin

    const orderDetailsWithTotals = await this.orderDetailRepository.createQueryBuilder('orderDetail')
      .innerJoinAndSelect('orderDetail.order', 'order')
      .innerJoinAndSelect('orderDetail.product', 'product')
      .innerJoinAndSelect('product.category', 'category')
      .innerJoinAndSelect('order.user', 'user')
      .select([
        'category.id',
        'category.name',
        'orderDetail.price',
        'product.categoryId',
      ])
      .addSelect('SUM(orderDetail.price)', 'totalPrice') // Sumatoria de los precios de venta
      .where('order.date >= :startDate', { startDate: startOfDayDate })
      .andWhere('order.date <= :endDate', { endDate: endOfDayDate })
      .andWhere('category.name = :name', { name })
      .groupBy('category.id, orderDetail.id, product.id') // Agrupamos los resultados
      .getRawAndEntities(); // Devuelve tanto los resultados agregados como las entidades originales

    return orderDetailsWithTotals;

  }

  async reportEntries(startDate: Date, endDate: Date, name: string) {
    //console.log(`Fecha inicio= ${startDate}, final= ${endDate}, nombre= ${name}`);
    const reportEntries = await this.entryRepository.createQueryBuilder('entry')
      .innerJoin('entry.product', 'product')
      .innerJoin('product.category', 'category')
      .select([
        'category.name AS categoryName',
      ])
      .addSelect('SUM(entry.purchaseTotalPrice)', 'purchaseTotalPrice') // Sumatoria de los precios de compra por categoría
      .where('entry.date >= :startDate', { startDate })
      .andWhere('entry.date <= :endDate', { endDate })
      .andWhere('category.name = :name', { name }) // Filtrar por el nombre de la categoría
      .groupBy('category.id') // Agrupar solo por la categoría
      .getRawMany(); // Usar `getRawMany` para obtener los resultados planos
    return reportEntries;
  }
  findOne(id: number) {
    return `This action returns a #${id} report`;
  }


}
