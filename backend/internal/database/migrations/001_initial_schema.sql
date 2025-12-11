-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EDUCATION TABLE
-- Stores degree information (MSc, BSc, etc.)
-- ============================================
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    grade VARCHAR(50),
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL, -- For URL routing (e.g., "msc-software-engineering")
    display_order INT DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MODULES TABLE
-- Individual courses within a degree
-- ============================================
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    education_id UUID NOT NULL REFERENCES education (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50), -- e.g., "CS501"
    grade VARCHAR(50),
    credits INT,
    semester VARCHAR(50),
    description TEXT,
    detailed_content JSONB, -- Rich content for detailed page (objectives, assignments, etc.)
    display_order INT DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SKILLS TABLE
-- Your technical skills
-- ============================================
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50), -- e.g., "Backend", "Frontend", "DevOps", "Data"
    proficiency_level INT CHECK (
        proficiency_level BETWEEN 0 AND 100
    ),
    years_experience DECIMAL(3, 1),
    status VARCHAR(50) DEFAULT 'active', -- "learning", "proficient", "expert", "inactive"
    first_learned_date DATE,
    last_used_date DATE,
    description TEXT,
    icon VARCHAR(50), -- For UI (e.g., "GoLang", "React")
    display_order INT DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SKILL HISTORY TABLE
-- Track skill progression over time
-- ============================================
CREATE TABLE skill_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    skill_id UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    proficiency_level INT,
    evidence_type VARCHAR(50), -- "project", "blog", "course", "certification"
    evidence_id UUID, -- References the project/blog/module
    notes TEXT,
    recorded_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROJECTS TABLE
-- Your portfolio projects
-- ============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    status VARCHAR(50) DEFAULT 'active', -- "active", "archived", "in-progress"
    start_date DATE,
    end_date DATE,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    difficulty_level VARCHAR(50), -- "beginner", "intermediate", "advanced"
    image_url VARCHAR(500),
    demo_video_url VARCHAR(500),
    display_order INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROJECT TECH STACK (Many-to-Many)
-- Technologies used in each project
-- ============================================
CREATE TABLE project_skills (
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills (id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false, -- Main tech used
    PRIMARY KEY (project_id, skill_id)
);

-- ============================================
-- BLOG POSTS TABLE
-- Your learning journal / blog
-- ============================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown content
    status VARCHAR(50) DEFAULT 'draft', -- "draft", "published", "archived"
    published_at TIMESTAMP
    WITH
        TIME ZONE,
        reading_time_minutes INT,
        view_count INT DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        series VARCHAR(100), -- e.g., "Learning Go" series
        series_order INT,
        cover_image_url VARCHAR(500),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BLOG TAGS (Many-to-Many)
-- Tag blog posts for filtering
-- ============================================
CREATE TABLE blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_post_tags (
    blog_post_id UUID REFERENCES blog_posts (id) ON DELETE CASCADE,
    blog_tag_id UUID REFERENCES blog_tags (id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, blog_tag_id)
);

-- ============================================
-- LEARNING GOALS TABLE
-- Track what you're learning and progress
-- ============================================
CREATE TABLE learning_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    goal TEXT NOT NULL,
    skill_id UUID REFERENCES skills (id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'exploring', -- "exploring", "learning", "proficient", "teaching"
    started_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        achieved_at TIMESTAMP
    WITH
        TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONTENT LINKS TABLE
-- Link everything together (skills, projects, blogs, education)
-- ============================================
CREATE TABLE content_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    from_type VARCHAR(50) NOT NULL, -- "education", "module", "project", "blog", "skill"
    from_id UUID NOT NULL,
    to_type VARCHAR(50) NOT NULL,
    to_id UUID NOT NULL,
    relationship VARCHAR(100), -- "inspired_by", "evidence_of", "learned_in", "applied_in"
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (
            from_type,
            from_id,
            to_type,
            to_id,
            relationship
        )
);

-- ============================================
-- ANALYTICS TABLE (Optional but useful)
-- Track page views, clicks, etc.
-- ============================================
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    event_type VARCHAR(50) NOT NULL, -- "page_view", "project_click", "blog_read", "cv_download"
    entity_type VARCHAR(50), -- "project", "blog", "skill"
    entity_id UUID,
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_modules_education ON modules (education_id);

CREATE INDEX idx_skill_history_skill ON skill_history (skill_id);

CREATE INDEX idx_projects_featured ON projects (featured)
WHERE
    featured = true;

CREATE INDEX idx_projects_status ON projects (status);

CREATE INDEX idx_blog_posts_status ON blog_posts (status);

CREATE INDEX idx_blog_posts_published ON blog_posts (published_at);

CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);

CREATE INDEX idx_content_links_from ON content_links (from_type, from_id);

CREATE INDEX idx_content_links_to ON content_links (to_type, to_id);

CREATE INDEX idx_analytics_created ON analytics_events (created_at);

CREATE INDEX idx_analytics_entity ON analytics_events (entity_type, entity_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically update updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON learning_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
