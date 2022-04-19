import {
  Component, OnInit, TemplateRef, ViewChild,
} from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { NbDialogRef, NbToastrService, NbDialogService } from '@nebular/theme';
import { User } from 'app/models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { Row } from 'ng2-smart-table/lib/lib/data-set/row';

@Component({
  selector: 'user',
  styleUrls: ['user.component.scss'],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  @ViewChild('ng2tbUser')ng2tbUser:Ng2SmartTableComponent;
  @ViewChild('dialogUser')dialogUser:TemplateRef<any>;
  @ViewChild('dialogDelete')dialogDelete:TemplateRef<any>;

  dialogRef:NbDialogRef<any>

  tbUserData:User[]
  tbUserConfig:Object
  userSelected: User

  formUser = this.formBuilder.group({
    _id: [null],
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
    creation: { value: null, disabled: true },
  });

  constructor(
    private formBuilder:FormBuilder,
    private dialogService:NbDialogService,
    private toastService:NbToastrService,
    private userService:UserService,
  ) { }

  ngOnInit(): void {
    this.setConfigTbUser();
    this.setDataTbUser();
  }
  private setConfigTbUser() {
    this.tbUserConfig = {
      mode: 'external',
      actions: { columnTitle: 'Ações', add: false, position: 'right' },
      edit: {
        editButtonContent: '<span class="nb-edit"  title="Editar"></span>',
      },
      delete: {
        deleteButtonContent: '<span class="nb-trash"  title="Excluir"></span>',
      },
      noDataMessage: 'Nenhum usuário cadastrado.',
      columns: {
        name: {
          title: 'Nome',
        },
        email: {
          title: 'E-mail',
        },
      },
    };
  }
  private setDataTbUser() {
    this.userService.list().subscribe((res) => {
      this.tbUserData = res.body;
    });
  }

  public openModalUser(event:Row) {
    this.formUser.reset();
    if (event) {
      const user:User = event.getData();
      this.userService.findById(user._id).subscribe((res) => {
        this.formUser.patchValue(res.body);
      });
    }
    this.dialogRef = this.dialogService.open(this.dialogDelete);
  }
}
