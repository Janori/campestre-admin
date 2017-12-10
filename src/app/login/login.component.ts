import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare var lscache: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {
  isLogging = false;
  error = false;
  errorMsg = "";
  displayForm:string = "display";

  usuario:any = {
    user: '',
    pass: ''
  }

  headerText():string{
    return this.isLogging ? "Autenticando..." : "Bienvenido";
  }

  constructor(private authService:AuthService,
              private router:Router) { }

  ngOnInit() {
  }

  login(forma:NgForm){
    this.error = false;

    if(!this.isLogging){
      this.isLogging = true;
      setTimeout(()=>{
        this.displayForm = "none";

        var data:any;
        let email = forma.value.user;
        let secret = forma.value.secret;
        if(email.indexOf("@") == -1){
          data = {
            "username":email,
            "password":secret
          }
        }else{
          data = {
            "email":email,
            "password": secret
          };
        }

        this.authService.login(data)
        .subscribe(result =>{
            console.log(result);
          if(!result.status) {
            this.errorMsg = "Usuario o contraseña incorrecta."
            this.loginError();
          }else {
              lscache.set('authToken', result.data.token, result.data.ttl);
              this.router.navigate(['/']);
          }
        }, error=>{
          this.errorMsg = "Ocurrió un error con el servidor.";
          this.loginError();
        });

      }, 1000)
    }
  }

  loginError(){
    this.error = true;
    this.isLogging = false;
    this.displayForm = "block";
  }

}
