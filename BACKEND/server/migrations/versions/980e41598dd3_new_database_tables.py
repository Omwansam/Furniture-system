"""New database tables with existence checks

Revision ID: 980e41598dd3
Revises: 05cffdba7f98
Create Date: 2025-08-22 11:37:43.510543
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '980e41598dd3'
down_revision = '05cffdba7f98'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # --- social_media_posts ---
    if 'social_media_posts' not in inspector.get_table_names():
        op.create_table(
            'social_media_posts',
            sa.Column('post_id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('platform', sa.String(length=50), nullable=False),
            sa.Column('post_url', sa.String(length=500), nullable=False),
            sa.Column('image_url', sa.String(length=500), nullable=False),
            sa.Column('caption', sa.Text(), nullable=True),
            sa.Column('likes_count', sa.Integer(), nullable=True),
            sa.Column('comments_count', sa.Integer(), nullable=True),
            sa.Column('posted_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.Column('is_featured', sa.Boolean(), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.PrimaryKeyConstraint('post_id')
        )

    # --- social_media_stats ---
    if 'social_media_stats' not in inspector.get_table_names():
        op.create_table(
            'social_media_stats',
            sa.Column('stat_id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('platform', sa.String(length=50), nullable=False),
            sa.Column('followers_count', sa.Integer(), nullable=True),
            sa.Column('posts_count', sa.Integer(), nullable=True),
            sa.Column('engagement_rate', sa.Float(), nullable=True),
            sa.Column('last_updated', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.PrimaryKeyConstraint('stat_id')
        )

    # --- blog_images ---
    if 'blog_images' not in inspector.get_table_names():
        op.create_table(
            'blog_images',
            sa.Column('image_id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('blog_post_id', sa.Integer(), nullable=False),
            sa.Column('filename', sa.String(length=200), nullable=False),
            sa.Column('image_url', sa.String(length=500), nullable=False),
            sa.Column('is_primary', sa.Boolean(), nullable=True),
            sa.Column('alt_text', sa.String(length=200), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
            sa.ForeignKeyConstraint(['blog_post_id'], ['blog_posts.id']),
            sa.PrimaryKeyConstraint('image_id')
        )

    # Drop old Blog_images table if it exists
    if 'Blog_images' in inspector.get_table_names():
        op.drop_table('Blog_images')

    # --- Alter blog_posts table ---
    with op.batch_alter_table('blog_posts', schema=None) as batch_op:
        if 'slug' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('slug', sa.String(length=250), nullable=False))
            batch_op.create_unique_constraint('uq_blog_posts_slug', ['slug'])

        if 'excerpt' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('excerpt', sa.Text(), nullable=False))

        if 'content' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('content', sa.Text(), nullable=False))

        if 'author' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('author', sa.String(length=100), nullable=True))

        if 'category' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('category', sa.String(length=50), nullable=False))

        if 'tags' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('tags', sa.String(length=200), nullable=True))

        if 'featured_image' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('featured_image', sa.String(length=500), nullable=True))

        if 'is_published' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('is_published', sa.Boolean(), nullable=True))

        if 'is_featured' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('is_featured', sa.Boolean(), nullable=True))

        if 'view_count' not in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.add_column(sa.Column('view_count', sa.Integer(), nullable=True))

        # Ensure title length is 200
        batch_op.alter_column('title',
            existing_type=sa.VARCHAR(length=150),
            type_=sa.String(length=200),
            existing_nullable=False
        )

        # Drop description if it still exists
        if 'description' in [c['name'] for c in inspector.get_columns('blog_posts')]:
            batch_op.drop_column('description')


def downgrade():
    # Revert blog_posts changes
    with op.batch_alter_table('blog_posts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.Text(), nullable=False))
        batch_op.drop_constraint('uq_blog_posts_slug', type_='unique')
        batch_op.alter_column('title',
            existing_type=sa.String(length=200),
            type_=sa.VARCHAR(length=150),
            existing_nullable=False)
        batch_op.drop_column('view_count')
        batch_op.drop_column('is_featured')
        batch_op.drop_column('is_published')
        batch_op.drop_column('featured_image')
        batch_op.drop_column('tags')
        batch_op.drop_column('category')
        batch_op.drop_column('author')
        batch_op.drop_column('content')
        batch_op.drop_column('excerpt')
        batch_op.drop_column('slug')

    # Restore old Blog_images table
    op.create_table(
        'Blog_images',
        sa.Column('image_id', sa.INTEGER(), nullable=False),
        sa.Column('filename', sa.VARCHAR(length=200), nullable=False),
        sa.Column('is_primary', sa.BOOLEAN(), nullable=True),
        sa.Column('created_at', sa.DATETIME(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('updated_at', sa.DATETIME(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.PrimaryKeyConstraint('image_id')
    )

    # Drop new tables
    op.drop_table('blog_images')
    op.drop_table('social_media_stats')
    op.drop_table('social_media_posts')
