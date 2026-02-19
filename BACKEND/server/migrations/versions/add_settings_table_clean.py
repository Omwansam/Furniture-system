"""add settings table clean

Revision ID: add_settings_table_clean
Revises: 840599ebc93f
Create Date: 2025-09-03 20:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = 'add_settings_table_clean'
down_revision = '840599ebc93f'
branch_labels = None
depends_on = None


def upgrade():
    # Check if settings table already exists
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    existing_tables = inspector.get_table_names()
    
    if 'settings' not in existing_tables:
        # Create settings table only if it doesn't exist
        op.create_table('settings',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('setting_key', sa.String(length=100), nullable=False),
            sa.Column('setting_value', sa.Text(), nullable=True),
            sa.Column('setting_type', sa.String(length=50), nullable=True),
            sa.Column('category', sa.String(length=50), nullable=True),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('is_editable', sa.Boolean(), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('setting_key')
        )
        print("✅ Settings table created")
    else:
        print("ℹ️  Settings table already exists, skipping creation")
    
    # Check if index already exists
    existing_indexes = inspector.get_indexes('settings')
    index_names = [idx['name'] for idx in existing_indexes]
    
    if 'ix_settings_category' not in index_names:
        # Create index on category for better performance
        op.create_index('ix_settings_category', 'settings', ['category'], unique=False)
        print("✅ Settings category index created")
    else:
        print("ℹ️  Settings category index already exists, skipping creation")


def downgrade():
    # Drop index first if it exists
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    if 'settings' in inspector.get_table_names():
        existing_indexes = inspector.get_indexes('settings')
        index_names = [idx['name'] for idx in existing_indexes]
        
        if 'ix_settings_category' in index_names:
            op.drop_index('ix_settings_category', table_name='settings')
            print("✅ Settings category index dropped")
    
    # Drop settings table if it exists
    if 'settings' in inspector.get_table_names():
        op.drop_table('settings')
        print("✅ Settings table dropped")
