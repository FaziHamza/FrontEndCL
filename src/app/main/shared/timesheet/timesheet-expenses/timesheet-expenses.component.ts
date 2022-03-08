import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';

import {CoreTranslationService} from '@core/services/translation.service';
import {FormBuilder} from "@angular/forms";
import { TimeSheetExpense } from 'app/shared/models/timeSheetExpense';
import { TimesheetExpenseService } from 'app/shared/services/timesheet-expense.service';
import {ToastrService} from "ngx-toastr";
import { environment } from 'environments/environment';

@Component({
    selector: 'app-timesheet-expenses',
    templateUrl: './timesheet-expenses.component.html',
    styleUrls: ['./timesheet-expenses.component.scss']
})
export class TimesheetExpensesComponent implements OnInit {


    constructor(public expensesService: TimesheetExpenseService, private fb: FormBuilder, private toastrService: ToastrService) {

    }

    isEmployer = true;
    isCollapsed: boolean = true;
    expenseTypes = [{name: 'General'}, {name: 'Instrumental'}];
    expensesList: TimeSheetExpense[];
    expensesModel: TimeSheetExpense;
    availableExpenses = [{
        id: 1,
        extension: '.pdf',
        fileName: "FileName That's quit big.pdf",
        expenseType: 'General',
        amount: 2000,
        comment: '',
        amountApproved: 2000,
        status: 'Pending',

    }];

    expenseForm = this.fb.group({
        id: '',
        expenseType: '',
        amount: '',
        comment: '',
        expenseFile: '',
    })

    ngOnInit() {

    }

    onCancel() {
        this.isCollapsed = true;
    }

    onApproveExpenseClick(b: boolean, exp: { extension: string; fileName: string; expenseType: string; amount: number; comment: string; id: number; amountApproved: number; status: string }) {
        if (b)
            exp.status = "Approved";
        else
            exp.status = "Rejected";
    }

    
    getAllExpenses()
    {
        this.expensesService.getTimeSheetExpense().subscribe(value => {
            debugger
            if (value.successFlag) 
            {
                this.expensesList = value.data;
            } 
            else 
            {
                this.toastrService.error(value.message);
            }
        }, 
        error => 
        {
            if (environment.logErrors)
                console.log(error);
        });
    }

    onAddExpense() {
        console.log(this.expenseForm.value);
        let fileName = this.getPlainFileName(this.expenseForm.value.expenseFile);
        debugger
        this.getAllExpenses();
        this.expensesModel.amount = 232;//this.expenseForm.controls.amount;
        this.expensesModel.isActive = true;
        this.expensesModel.expenseTypeId =  1;//this.expenseForm.controls.amount; this.expenseForm.value.expenseType;
        this.expensesModel.fileName = fileName;
        this.expensesModel.comment = 233;//this.expenseForm.controls.comment;
      
        this.expensesService.saveTimeSheetExpense(this.expensesModel).subscribe(value => {
            
            if (value.successFlag) 
            {
                this.toastrService.success(value.message);
                this.getAllExpenses();
            }
            else 
            {
                this.toastrService.error(value.message);
            }
        }, 
        error => 
        {
            if (environment.logErrors)
                console.log(error);
        });

        this.expenseForm.reset();
        this.isCollapsed = true;
        // if (this.expenseForm.value.id !== null && this.expenseForm.value.id !== undefined && this.expenseForm.value.id !== '') {
        //     // Edit Mode so update instead
        //     let f = this.availableExpenses.find(f => f.id === this.expenseForm.value.id);
        //     f.status = 'Pending';
        //     f.amount = this.expenseForm.value.amount;
        //     f.expenseType = this.expenseForm.value.expenseType;

        //     //NOTE: Upload the File Before doing this.
        //     if (fileName !== null && fileName !== undefined && fileName !== '') {
        //         f.fileName = fileName;
        //         f.extension = fileName.split('.')[fileName.split('.').length - 1];
        //     }

        //     f.amountApproved = this.expenseForm.value.amount;
        //     f.comment = this.expenseForm.value.comment;

        // } else {
        //     this.availableExpenses.push({
        //         id: this.availableExpenses.length + 1,
        //         status: 'Pending',
        //         amount: this.expenseForm.value.amount,
        //         expenseType: this.expenseForm.value.expenseType,
        //         fileName: fileName,
        //         extension: fileName.split('.')[fileName.split('.').length - 1],
        //         amountApproved: this.expenseForm.value.amount,
        //         comment: this.expenseForm.value.comment
        //     });
        // }
    }

    onEditExpense(exp: { extension: string; fileName: string; expenseType: string; amount: number; comment: string; id: number; amountApproved: number; status: string }) {
        this.expenseForm.get("id").patchValue(exp.id, {onlySelf: true});
        this.expenseForm.get("expenseType").patchValue(exp.expenseType, {onlySelf: true});
        this.expenseForm.get("amount").patchValue(exp.amount, {onlySelf: true});
        this.expenseForm.get("comment").patchValue(exp.comment, {onlySelf: true});
        // this.expenseForm.get("expenseFile").set(exp.fileName, {onlySelf: true});
        this.isCollapsed = false;
    }

    onDeleteExpense(exp: { extension: string; fileName: string; expenseType: string; amount: number; comment: string; id: number; amountApproved: number; status: string }) {
        this.availableExpenses.splice(this.availableExpenses.indexOf(exp), 1);
    }

    getStyleForStatus(status: string) {
        return status === 'Pending' ? 'primary' : (status === 'Rejected' ? 'danger' : 'success');
    }

    getPlainFileName(value: any): string {
        if (value === null || value === undefined || value === '')
            return '';
        let paths = this.expenseForm.value.expenseFile.split('\\');
        return paths[paths.length - 1];
    }
}
