import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { SessionStorageService } from "../services/session-storage.service";

@Injectable({
  providedIn: 'root'
})
export class MyAuthGuard implements CanActivate {

  constructor(private router: Router, private storageService: SessionStorageService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isLogged: boolean = this.storageService.isUserLogged();
    const requiredRole: string | undefined = route.data["requiredRole"];

    if(!requiredRole){
      if(isLogged){
        return true;
      }
    }

    if (isLogged && requiredRole) {
      const userRole: string | null = this.storageService.getData("role"); // Assuming you have a method to fetch the user's role
      if (userRole && userRole === requiredRole) {
        return true; // User is logged in and has the required role, allow access to the route
      } else {
        // User does not have the required role, navigate to a different route or show an error
        return this.router.createUrlTree(['/home']); // Redirect to the home route in this example
      }
    } else {
      // User is not logged in or requiredRole is not specified, navigate to the login route
      return this.router.createUrlTree(['/auth']);
    }
  }
}
