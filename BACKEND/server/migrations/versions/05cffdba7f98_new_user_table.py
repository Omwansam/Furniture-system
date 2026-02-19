"""NEW USER TABLE

Revision ID: 05cffdba7f98
Revises: d2816602bd2c
Create Date: 2025-08-14 13:11:45.263020
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = '05cffdba7f98'
down_revision = 'd2816602bd2c'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)

    # Drop admins table only if it exists
    if 'admins' in inspector.get_table_names():
        op.drop_table('admins')

    # Modify shipping_information table
    with op.batch_alter_table('shipping_information', schema=None) as batch_op:
        batch_op.add_column(sa.Column('order_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(
            'fk_shipping_order',  # FK name
            'orders',             # target table
            ['order_id'],         # local column
            ['order_id']          # target column
        )

    # Add is_admin column to users with default false
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.text('0'))
        )


def downgrade():
    # Remove is_admin column
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('is_admin')

    # Remove foreign key and column from shipping_information
    with op.batch_alter_table('shipping_information', schema=None) as batch_op:
        batch_op.drop_constraint('fk_shipping_order', type_='foreignkey')
        batch_op.drop_column('order_id')

    # Recreate admins table
    op.create_table(
        'admins',
        sa.Column('id', sa.INTEGER(), primary_key=True),
        sa.Column('username', sa.VARCHAR(length=80), nullable=False, unique=True),
        sa.Column('email', sa.VARCHAR(length=120), nullable=False, unique=True),
        sa.Column('password_hash', sa.VARCHAR(length=265), nullable=False)
    )
