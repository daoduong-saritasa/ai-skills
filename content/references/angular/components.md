# Angular Component Examples

## Modern Component with Signals & Native Control Flow

```typescript
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core'
import { finalize } from 'rxjs/operators'
import { UserService } from './user.service'
import { User } from './user.model'

@Component({
  selector: 'app-user-list',
  imports: [],
  template: `
    @if (loading()) { <div>Loading...</div> }
    @for (user of users(); track user.id) {
      <button type="button" (click)="handleSelect(user)" [class.active]="selectedId() === user.id">
        {{ user.name }}
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.has-users]': 'users().length > 0' },
})
export class UserListComponent {
  private readonly userService = inject(UserService)
  protected readonly users = signal<User[]>([])
  protected readonly loading = signal(false)
  protected readonly selectedId = signal<number | null>(null)

  constructor() {
    this.loading.set(true)
    this.userService.getUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (u) => this.users.set(u) })
  }

  protected handleSelect(user: User): void {
    this.selectedId.set(user.id)
  }
}
```
