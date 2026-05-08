# React Hooks Examples

## Custom Hook with Business Logic

```tsx
// ✅ Business logic in custom hook — UI layer stays clean
function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
}

// ✅ Component stays focused on rendering
const UserList: React.FC = () => {
  const { users, loading } = useUserManagement();
  if (loading) return <Spinner />;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};
```
