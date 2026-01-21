"""Update database IDs to use UUIDs instead INT

Revision ID: 6da479e5284b
Revises: 194405163dc4
Create Date: 2026-01-21 17:05:31.803985

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6da479e5284b"
down_revision: Union[str, Sequence[str], None] = "194405163dc4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop suppliers table and related constraints first
    op.drop_constraint("services_supplier_id_fkey", "services", type_="foreignkey")
    op.drop_column("services", "supplier_id")
    op.drop_index(op.f("ix_suppliers_id"), table_name="suppliers")
    op.drop_table("suppliers")

    # Step 1: Drop all foreign key constraints
    op.drop_constraint("clients_user_id_fkey", "clients", type_="foreignkey")
    op.drop_constraint("contracts_user_id_fkey", "contracts", type_="foreignkey")
    op.drop_constraint("contracts_service_id_fkey", "contracts", type_="foreignkey")
    op.drop_constraint("contracts_client_id_fkey", "contracts", type_="foreignkey")
    op.drop_constraint("services_user_id_fkey", "services", type_="foreignkey")

    # Step 2: Add UUID extension if not exists
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    # Step 3: Convert all ID columns to UUID
    # Users table
    op.execute("ALTER TABLE users DROP CONSTRAINT users_pkey CASCADE")
    op.execute("ALTER TABLE users ALTER COLUMN id DROP DEFAULT")
    op.execute("ALTER TABLE users ALTER COLUMN id TYPE UUID USING uuid_generate_v4()")
    op.execute("ALTER TABLE users ADD PRIMARY KEY (id)")

    # Services table
    op.execute("ALTER TABLE services DROP CONSTRAINT services_pkey CASCADE")
    op.execute("ALTER TABLE services ALTER COLUMN id DROP DEFAULT")
    op.execute(
        "ALTER TABLE services ALTER COLUMN id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute(
        "ALTER TABLE services ALTER COLUMN user_id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute("ALTER TABLE services ADD PRIMARY KEY (id)")

    # Clients table
    op.execute("ALTER TABLE clients DROP CONSTRAINT clients_pkey CASCADE")
    op.execute("ALTER TABLE clients ALTER COLUMN id DROP DEFAULT")
    op.execute("ALTER TABLE clients ALTER COLUMN user_id DROP DEFAULT")
    op.execute("ALTER TABLE clients ALTER COLUMN id TYPE UUID USING uuid_generate_v4()")
    op.execute(
        "ALTER TABLE clients ALTER COLUMN user_id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute("ALTER TABLE clients ADD PRIMARY KEY (id)")

    # Contracts table
    op.execute("ALTER TABLE contracts DROP CONSTRAINT contracts_pkey CASCADE")
    op.execute("ALTER TABLE contracts ALTER COLUMN id DROP DEFAULT")
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN user_id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN service_id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN client_id TYPE UUID USING uuid_generate_v4()"
    )
    op.execute("ALTER TABLE contracts ADD PRIMARY KEY (id)")

    # Step 4: Recreate foreign key constraints
    op.create_foreign_key(
        "clients_user_id_fkey",
        "clients",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "services_user_id_fkey",
        "services",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "contracts_user_id_fkey",
        "contracts",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "contracts_service_id_fkey",
        "contracts",
        "services",
        ["service_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "contracts_client_id_fkey",
        "contracts",
        "clients",
        ["client_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Step 5: Drop old sequences
    op.execute("DROP SEQUENCE IF EXISTS users_id_seq CASCADE")
    op.execute("DROP SEQUENCE IF EXISTS services_id_seq CASCADE")


def downgrade() -> None:
    """Downgrade schema."""
    # This is a destructive migration - downgrade will lose all data
    # Step 1: Drop foreign key constraints
    op.drop_constraint("contracts_client_id_fkey", "contracts", type_="foreignkey")
    op.drop_constraint("contracts_service_id_fkey", "contracts", type_="foreignkey")
    op.drop_constraint("contracts_user_id_fkey", "contracts", type_="foreignkey")
    op.drop_constraint("services_user_id_fkey", "services", type_="foreignkey")
    op.drop_constraint("clients_user_id_fkey", "clients", type_="foreignkey")

    # Step 2: Recreate sequences
    op.execute("CREATE SEQUENCE users_id_seq")
    op.execute("CREATE SEQUENCE services_id_seq")

    # Step 3: Convert UUID columns back to INTEGER
    # Users table
    op.execute("ALTER TABLE users DROP CONSTRAINT users_pkey CASCADE")
    op.execute(
        "ALTER TABLE users ALTER COLUMN id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute(
        "ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass)"
    )
    op.execute("ALTER TABLE users ADD PRIMARY KEY (id)")

    # Services table
    op.execute("ALTER TABLE services DROP CONSTRAINT services_pkey CASCADE")
    op.execute(
        "ALTER TABLE services ALTER COLUMN id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute(
        "ALTER TABLE services ALTER COLUMN id SET DEFAULT nextval('services_id_seq'::regclass)"
    )
    op.execute(
        "ALTER TABLE services ALTER COLUMN user_id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute("ALTER TABLE services ADD PRIMARY KEY (id)")

    # Clients table
    op.execute("ALTER TABLE clients DROP CONSTRAINT clients_pkey CASCADE")
    op.execute(
        "ALTER TABLE clients ALTER COLUMN id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute(
        "ALTER TABLE clients ALTER COLUMN user_id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute("ALTER TABLE clients ADD PRIMARY KEY (id)")

    # Contracts table
    op.execute("ALTER TABLE contracts DROP CONSTRAINT contracts_pkey CASCADE")
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN user_id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN service_id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute(
        "ALTER TABLE contracts ALTER COLUMN client_id TYPE INTEGER USING (random()*2147483647)::integer"
    )
    op.execute("ALTER TABLE contracts ADD PRIMARY KEY (id)")

    # Step 4: Recreate foreign key constraints
    op.create_foreign_key(
        "clients_user_id_fkey",
        "clients",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "services_user_id_fkey",
        "services",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "contracts_user_id_fkey",
        "contracts",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "contracts_service_id_fkey",
        "contracts",
        "services",
        ["service_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "contracts_client_id_fkey",
        "contracts",
        "clients",
        ["client_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Step 5: Recreate suppliers table
    op.create_table(
        "suppliers",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column("name", sa.VARCHAR(length=100), autoincrement=False, nullable=False),
        sa.Column("email", sa.VARCHAR(length=50), autoincrement=False, nullable=False),
        sa.Column("phone", sa.VARCHAR(length=11), autoincrement=False, nullable=False),
        sa.Column("status", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.PrimaryKeyConstraint("id", name="suppliers_pkey"),
    )
    op.create_index("ix_suppliers_id", "suppliers", ["id"], unique=False)

    # Add back supplier_id to services
    op.add_column(
        "services",
        sa.Column("supplier_id", sa.INTEGER(), autoincrement=False, nullable=True),
    )
    op.create_foreign_key(
        "services_supplier_id_fkey",
        "services",
        "suppliers",
        ["supplier_id"],
        ["id"],
    )
    op.create_index(op.f("ix_suppliers_id"), "suppliers", ["id"], unique=False)
    # ### end Alembic commands ###
