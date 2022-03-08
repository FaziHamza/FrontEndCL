import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent} from '@swimlane/ngx-datatable';
import {Subject} from "rxjs";
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Lookup} from "../../../shared/models/lookup";
import {LookupService} from "../../../shared/services/lookup.service";
import {environment} from "../../../../environments/environment";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {ToastrService} from "ngx-toastr";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-lookups',
    templateUrl: './lookups.component.html',
    styleUrls: ['./lookups.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LookupsComponent implements OnInit {
    public ColumnMode = ColumnMode;

    public rows: Lookup[] = [];
    public miscData:any;
    public kitchenSinkRows: any;

    public editingCategory = {};
    public editingSubCategory = {};
    public editingDescription = {};
    public editingComment = {};
    public editingOrder = {};
    public editingIsValid = {};
    public editingIsActive = {};
    public editinglookupValue = {};
    public editingRows: Lookup[] = [];
    SaveAllDisabled:boolean=true;

    @BlockUI('tableBlockUI') tableBlockUI: NgBlockUI;

    @ViewChild(DatatableComponent) table: DatatableComponent;
    contentHeader: ContentHeader;
    isAddLookupCollapsed: boolean = true;
    mainForm: FormGroup = this.fb.group({
        lookupId: 0,
        // category: [null,Validators.required],
        // subCategory: [null,Validators.required],
        // description: [null,Validators.required],
        category: '',
        subCategory: '',
        description: '',
        lookupValue: '',
        comment: '',
        order: 0
    });
    isSearched: boolean = false;
    private _unsubscribeAll: Subject<any>;
    private tempData = [];
    disabled: boolean = true;
    currentRowId: number = 0;
    isRowEditable: boolean = false;
    hideAddButton: boolean= false;
    required: boolean;

    constructor(private lookupService: LookupService, private fb: FormBuilder, private toastrService: ToastrService) {
        //this.loadData();
    }

    ngOnInit(): void {
        this.contentHeader = {
            headerTitle: 'Lookups',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: '-',
                        isLink: false,
                        link: '/admin/lookups'
                    }
                ]
            }
        };
        this.searchRequiredFields();
    }
    searchRequiredFields()
    {
        // const loCategory=this.mainForm.controls.category;
        // const loSubCategory=this.mainForm.controls.subCategory;
        // const loDescription=this.mainForm.controls.description;
        // const newValidators=[];
        // loCategory.setValidators(newValidators);
        // loCategory.updateValueAndValidity();
        // loSubCategory.setValidators(newValidators);
        // loSubCategory.updateValueAndValidity();
        // loDescription.setValidators(newValidators);
        // loDescription.updateValueAndValidity();
        // if(this.mainForm.valid)
        //     console.log('searchRequiredFields method call valid');
    }
    // /**
    //  * Inline editing Name
    //  *
    //  * @param event
    //  * @param cell
    //  * @param rowIndex
    //  */
    // inlineEditingUpdateCategory(event, cell, rowIndex) {
    //     this.editingCategory[rowIndex + '-' + cell] = false;
    //     this.rows[rowIndex][cell] = event.target.value;
    //     this.rows = [...this.rows];
    // }

    // /**
    //  * Inline editing Salary
    //  *
    //  * @param event
    //  * @param cell
    //  * @param rowIndex
    //  */
    // inlineEditingUpdateSubCategory(event, cell, rowIndex) {
    //     this.editingSubCategory[rowIndex + '-' + cell] = false;
    //     this.rows[rowIndex][cell] = event.target.value;
    //     this.rows = [...this.rows];
    // }

    // /**
    //  * Inline editing Age
    //  *
    //  * @param event
    //  * @param cell
    //  * @param rowIndex
    //  */
    // inlineEditingUpdateDescription(event, cell, rowIndex) {
    //     this.editingDescription[rowIndex + '-' + cell] = false;
    //     this.rows[rowIndex][cell] = event.target.value;
    //     this.rows = [...this.rows];
    // }   

    /**
     * Inline editing Status
     *
     * @param event
     * @param cell
     * @param rowIndex
     */
    inlineEditingUpdate(event, cell, rowIndex) {
        debugger
        //this.tableBlockUI.start("Saving Order...")        
        this.editingCategory[rowIndex + '-' + cell] = false;
        this.editingSubCategory[rowIndex + '-' + cell] = false;
        this.editingDescription[rowIndex + '-' + cell] = false;
        this.editingComment[rowIndex + '-' + cell] = false;        
        this.editinglookupValue[rowIndex + '-' + cell] = false;
        this.editingIsValid[rowIndex + '-' + cell] = false;
        this.editingIsActive[rowIndex + '-' + cell] = false;
        this.editingOrder[rowIndex + '-' + cell] = false;
        let exists=false;
        let flgCategory=false;
        let valCategory='';
        let flgSubCategory=false;
        let valSubCategory='';
        let flgDescription=false;
        let valDescription='';
        
       // this.onEditClick(this.mainForm)
        //console.log(row);
        if(cell==='category')
        {            
            flgCategory=true;
            valCategory= event.target.value;
        }
        if(cell==='subCategory')
        {            
            flgSubCategory=true;
            valSubCategory= event.target.value;
        }
        if(cell==='description')
        {            
            flgDescription=true;
            valDescription= event.target.value;
        }
        
        if(cell!=='isValid' || cell!=='isActive')
        {            
            if(flgCategory)
            {
            //     this.rows.forEach(element => {
                // if( element.category === valCategory )
                // {
                //         this.toastrService.show('This row already exits');
                //         exists=true;
                //         return;
                // }
                
            //     });  
            if(valCategory === "" )
            {
                this.toastrService.show('Category cannot be empty!');
                exists=true;
            }              
            }
            if(flgSubCategory)
            {
            //     this.rows.forEach(element => {
            //     if( element.subCategory === valSubCategory )
            //         {
            //             this.toastrService.show('This row already exits');
            //             exists=true;
            //         }
                    
            //     });
            if( valSubCategory === "" )
            {
                this.toastrService.show('SubCategory cannot be empty!');
                exists=true;
            }
            }

            if(flgDescription)
            {
                if( valDescription === "" )
                {
                    this.toastrService.show('Description cannot be empty!');
                    exists=true;
                    return;
                }
                this.rows.forEach(element => {
                    if( element.description === valDescription )
                    {
                        this.toastrService.show('This row already exits');
                        exists=true;
                    }
                    
                });
            }
        }        

        if(!exists)
        {
            if(cell==='isValid' || cell==='isActive')
                    this.rows[rowIndex][cell] = event.target.checked;
            else 
                    this.rows[rowIndex][cell] = event.target.value;

            this.rows = [...this.rows];
            if(this.rows[rowIndex].lookupId !=0)
            {
            // this.editingRows.forEach(element => {
            //     if(element.lookupId ==this.rows[rowIndex].lookupId)
            //         this.editingRows.splice(rowIndex, 1);
            //     });
                //if(!this.editingRows.find(x => x.lookupId == this.rows[rowIndex].lookupId))
                this.editingRows.push(this.rows[rowIndex]);
            }
            else{
                //this.editingRows.forEach(element => {
                    // if(element.category ==this.rows[rowIndex].category && element.subCategory ==this.rows[rowIndex].subCategory && element.description ==this.rows[rowIndex].description && element.comment ==this.rows[rowIndex].comment && element.order ==this.rows[rowIndex].order && element.isValid ==this.rows[rowIndex].isValid && element.isActive ==this.rows[rowIndex].isActive)
                    //     this.editingRows.splice(rowIndex, 1);
                   //});
                    this.editingRows.splice(rowIndex, 1);
                    this.editingRows.push(this.rows[rowIndex]);
            }
                console.log(this.editingRows);
                if(this.editingRows.length>0)
                    this.SaveAllDisabled=false;            
        }

        // this.lookupService.reOrderLookup(this.rows[rowIndex].id, event.target.value).subscribe(value => {
        //     this.tableBlockUI.stop();
        //     if (environment.showLogs) console.log(value);
        //     if (value.successFlag) {
        //         this.loadData();
        //     }
        // }, error => {
        //     this.tableBlockUI.stop();
        //     if (environment.logErrors)
        //         console.log(error);
        // });
    }

    /**
     * Search (filter)
     *
     * @param event
     */

     onClick_Delete(id : number)
     { 
        debugger
        this.lookupService.deleteLookup(id).subscribe(value => {
        this.tableBlockUI.stop();
        if (environment.showLogs) 
            console.log(value);
        if (value.successFlag) 
        {
            //this.loadData();
            this.hideAddButton = false;
            this.editingRows=[];
            this.onCancelLookup();
            this.SaveAllDisabled=true;
            this.currentRowId = 0;
            this.toastrService.success(value.message);
            this.onSearchLookup_SearchAll();
        }
        else {
            this.toastrService.error(value.message);
            // this.editingRows=[];
            // this.SaveAllDisabled=true;
            // this.onSearchLookup();
        }
    }, error => {
        this.tableBlockUI.stop();
        if (environment.logErrors)
            console.log(error);
    });
     }

    filterUpdate(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.tempData.filter(function (d) {
            return d.full_name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.kitchenSinkRows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    loadData(queries?) {
        //debugger
        this.tableBlockUI.start("Loading Lookup Data...");
        this.lookupService.getAll(queries).subscribe(value => {
            if (environment.showLogs)
                console.log(value);

            if (value.successFlag) {
                this.rows = value.data;
                //this.miscData=value.miscData;                
                // this.rows.splice(0, this.rows.length);
                // this.rows.push(...value.data);
                //console.log(this.rows);
            } else {

            }

            this.tableBlockUI.stop();
        }, error => {
            if (environment.logErrors)
                console.log(error);
            this.tableBlockUI.stop();
        });
    }
    onSaveLookupOrders()
    {
        debugger
        const unique = this.editingRows.map(item => item) .filter((value, index, self) => self.indexOf(value) === index)
        this.editingRows = unique;
            this.tableBlockUI.start("Loading Lookup Data...");        
            this.lookupService.saveLookupOrders(this.editingRows).subscribe(value => {
                this.tableBlockUI.stop();
                if (environment.showLogs) 
                    console.log(value);
                if (value.successFlag) 
                {
                    //this.loadData();
                    this.hideAddButton = false;
                    this.editingRows=[];
                    this.onCancelLookup();
                    this.SaveAllDisabled=true;
                    this.currentRowId = 0;
                    this.toastrService.success(value.message)
                    //this.onSearchLookup_SearchAll();
                }
                else {
                    this.toastrService.error(value.message);
                    // this.editingRows=[];
                    // this.SaveAllDisabled=true;
                    // this.onSearchLookup();
                }
            }, error => {
                this.tableBlockUI.stop();
                if (environment.logErrors)
                    console.log(error);
            });
    }
    validateAllFormFields(formGroup: FormGroup) {         //{1}
        Object.keys(formGroup.controls).forEach(field => {  //{2}
          const control = formGroup.get(field);             //{3}
          if (control instanceof FormControl) {             //{4}
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {        //{5}
            this.validateAllFormFields(control);            //{6}
          }
        });
      }
      
    onSubmitLookup() {        
        this.validateAllFormFields(this.mainForm);
        (this.mainForm.value.id === 0 ? this.lookupService.create(this.mainForm.value) : this.lookupService.update(this.mainForm.value)).subscribe(value => {
            if (environment.showLogs) {
                console.log(value);
            }

            if (value.successFlag) {
                console.log(value);
                this.toastrService.success(value.message)
                //this.onCancelLookup();
                this.onSearchLookup();
            } else {
                this.toastrService.error(value.message);
                // this.loadData();
                this.onSearchLookup();
            }

        }, error => {
            if (environment.logErrors)
                console.log(error);
            //this.toastrService.error("Something Uncertain happened...");
        });

    }
    onAddLookupRow() {
        debugger
        if(this.mainForm.controls.category == null)
        {
            this.toastrService.error("Category is required.");
        }
        else  if(this.mainForm.controls.subCategory == null)
        {
            this.toastrService.error("Sub-Category is required.");
        }
        else  if(this.mainForm.controls.description == null)
        {
            this.toastrService.error("Description is required.");
        }
        else
        {
            // if(this.rows.length == 0)
            // {
                this.appendLookupRow();
            // }
            // else if(this.rows.length != 1)
            // {
            //     this.appendLookupRow();
            // }
        }
    }
    appendLookupRow()
    {
        this.hideAddButton = true;
        const loCategory=this.mainForm.controls.category;
        const loSubCategory=this.mainForm.controls.subCategory;
        const loDescription=this.mainForm.controls.description;
        let rowIndex=this.rows.length;        
        let rowData = {
            id:0,
            category: loCategory.value,
            subCategory: loSubCategory.value,
            description: loDescription.value,
            lookupValue: 0,
            comment:"comment",
            order:0,
            isValid:true,
            isActive:true,
            createdDate: new Date(),
            modifiedDate:null,
            createdById:0,
            modifiedById:0,
            countOfContacts:null
          };
          
          this.onCancelLookup();          
          this.rows.splice(rowIndex, 0, rowData);
          this.rows = [...this.rows];
          this.SaveAllDisabled=false;
    }
    onSearchLookup() {        
        const loCategory=this.mainForm.controls.category;
        const loSubCategory=this.mainForm.controls.subCategory;
        const loDescription=this.mainForm.controls.description;
        debugger
        
        if(loCategory.value != '')
        {
            this.disabled = false;
            if(loCategory.value != '')
            this.search_LookupCallToAPI(loCategory.value);
        }
        else if(loSubCategory.value != '')
        { 
            this.disabled = false;
            if(loSubCategory.value != '')
            this.search_LookupCallToAPI(loSubCategory.value);
        }
        else if(loDescription.value != '')
        { 
            this.disabled = false;
            if(loDescription.value != '')
            this.search_LookupCallToAPI(loDescription.value);
        }
        else
        {
            this.toastrService.error('Category or SubCategory or  Description is required.');           
        }
    }
    
    search_LookupCallToAPI(inputValue)
    {
        debugger
                this.contentHeader = {
                    headerTitle: 'Lookups',
                    actionButton: true,
                    breadcrumb: {
                        type: '',
                        links: [
                        {
                        name: '-',
                        isLink: false,
                        link: '/admin/lookups'
                        }
                            ]
                    }
                };
                this.isSearched = true
                let val = this.mainForm.value;
                let fS = val.category + "|" + val.subCategory + "|" + val.description;
                this.loadData({search: fS});
            
    }
  
    
    onKeyUp_isDescriptionSearchValid(field)
    {
        debugger
        if(field.value === '')
        {
            this.disabled = true;
        }
        else
        {
            this.disabled = false;
        }
    }
    onKeyUp_isNull(event)
    {
        debugger
        if(event.target.value == null)
        {
            this.required = true;
        }
        else
        {
            this.required = false;
        }
    }
    
    onKeyUp_isSubCategorySearchValid(field)
    {
        debugger
        
        if(field.value === '')
        {
            this.disabled = true;
        }
        else
        {
            this.disabled = false;
        }
    }
    
    onKeyUp_isCategorySearchValid(field)
    {
        debugger
        
        if(field.value === '')
        {
            this.disabled = true;
        }
        else
        {
            this.disabled = false;
        }
    }
    onSearchLookup_SearchAll() { 
      this.currentRowId = 0;
        this.contentHeader = {
                headerTitle: 'Lookups',
                actionButton: true,
                breadcrumb: {
                    type: '',
                    links: [
                    {
                    name: '-',
                    isLink: false,
                    link: '/admin/lookups'
                    }
                        ]
                }
            };
        this.isSearched = true
        this.loadData({search: ''});

    }
    // onActivate(event) {
    //     if(event.type == 'click') {
    //         console.log(event.row);
    //     }
    // }
    onCancelLookup() {
        this.mainForm.reset({
            id: 0,
            category: '',
            subCategory: '',
            description: '',
            lookupValue: '',
            comment: '',
            order: 0
        });
        this.isAddLookupCollapsed = true;
        //this.loadData();
    }

    onEditClick(row: Lookup) {
        //this.isAddLookupCollapsed = false;
        debugger
        this.isSearched = true;
        this.mainForm.reset({
            id: 0,
            category: row.category,
            subCategory: row.subCategory,
            description: row.description,
            lookupValue: row.lookupValue,
            comment: row.comment,
            order: row.order
        });
        this.currentRowId = row.lookupId;
        
        this.SaveAllDisabled=false;
        //this.editingRows.push(row);
        //this.rows[rowIndex].lookupId
        //this.isRowEditable = true;
        //this.editingCategory[row.lookupId + '-category'] = true;
    }
    handlePageChange (event: any): void {
        console.log(event); 
      }
     
    confirmSave() 
    {
       return Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to save ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                this.onSaveLookupOrders();
            }
          });
    }

    confirmDelete(id) 
    {
       return Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to delete this record ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7367F0',
            cancelButtonColor: '#E42728',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                this.onClick_Delete(id);
            }
          });
    }
}
