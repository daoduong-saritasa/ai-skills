# Angular RxJS Examples

## Service with Observable State

```typescript
import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, EMPTY, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient)
  private readonly mapper = inject(UserMapper)

  private readonly usersSubject = new BehaviorSubject<User[]>([])
  readonly users$ = this.usersSubject.asObservable()
  readonly activeUsers$ = this.users$.pipe(map(u => u.filter(x => x.isActive)))

  getUsers(): Observable<User[]> {
    return this.http.get<unknown[]>('/users').pipe(
      map(dtos => dtos.map(dto => this.mapper.fromDto(dto))),
      tap(users => this.usersSubject.next(users)),
      catchError(err => { console.error(err); return EMPTY }),
    )
  }
}
```
