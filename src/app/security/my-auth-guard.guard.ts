import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MyAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      switchMap((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          const requiredRole = route.data['requiredRole']; // Get the required role from route data
          return this.authService.user$.pipe(
            map(user => {
              if (user && user['role']) {
                const userRole = user['role'];
                if (userRole === requiredRole) {
                  return true;
                } else {
                  this.router.navigate(['/unauthorized']);
                  return false;
                }
              } else {
                this.router.navigate(['/unauthorized']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/unauthorized']);
          return new Observable<boolean | UrlTree>(observer => {
            observer.next(false);
            observer.complete();
          });
        }
      })
    );
  }
}
