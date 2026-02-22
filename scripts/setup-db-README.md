# Cấu hình PostgreSQL cho quocgia-admin-service

Port **5432** đang được sử dụng bởi một PostgreSQL khác. Có 2 cách:

## Cách 1: Dùng PostgreSQL đang chạy (khuyến nghị)

Vào psql (hoặc pgAdmin) với quyền superuser (ví dụ user `postgres`), chạy:

```sql
CREATE USER heritage_user WITH PASSWORD 'heritage_pass_123';
CREATE DATABASE heritage_db OWNER heritage_user;
\c heritage_db
-- Sau đó chạy nội dung file init.sql
\i /path/to/init.sql
```

Hoặc trên Windows (cmd/PowerShell với psql trong PATH):

```bash
psql -U postgres -h localhost -c "CREATE USER heritage_user WITH PASSWORD 'heritage_pass_123';"
psql -U postgres -h localhost -c "CREATE DATABASE heritage_db OWNER heritage_user;"
psql -U postgres -h localhost -d heritage_db -f init.sql
```

Đảm bảo file `.env` có:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=heritage_user
DB_PASSWORD=heritage_pass_123
DB_NAME=heritage_db
```

## Cách 2: Dùng Docker

1. Dừng dịch vụ/process đang chiếm port 5432.
2. Trong thư mục `quocgia-admin-service` chạy:
   ```bash
   docker-compose up -d postgres
   ```
3. Đợi container healthy rồi khởi động lại backend.
