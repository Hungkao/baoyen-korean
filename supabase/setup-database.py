"""Apply the project's schema; password is requested without echo and never saved."""
import getpass
from pathlib import Path
# pyrefly: ignore [missing-import]
import psycopg

password = getpass.getpass('Supabase database password: ')
try:
    with psycopg.connect(host='aws-0-ap-northeast-2.pooler.supabase.com', port=5432,
                        dbname='postgres', user='postgres.eddzsetcuzmpbwhjdurz', password=password,
                        sslmode='require', connect_timeout=10) as connection:
        connection.execute(Path(__file__).resolve().parents[1].joinpath('supabase/schema.sql').read_text(encoding='utf-8'))
        result = connection.execute("select relrowsecurity from pg_class where oid='public.learning_progress'::regclass").fetchone()
        print('Schema applied. Row level security:', bool(result[0]))
except psycopg.Error as error:
    print('Database setup failed:', type(error).__name__)
    raise SystemExit(1) from None
finally:
    password = None
