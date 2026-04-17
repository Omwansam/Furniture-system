"""wishlist_items for user saved products

Revision ID: c8f4a1b2e3d4
Revises: 9b8082a9de2f
Create Date: 2026-04-16

"""
from alembic import op
import sqlalchemy as sa

revision = "c8f4a1b2e3d4"
down_revision = "9b8082a9de2f"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "wishlist_items",
        sa.Column("wishlist_item_id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
        sa.PrimaryKeyConstraint("wishlist_item_id"),
        sa.UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),
    )


def downgrade():
    op.drop_table("wishlist_items")
