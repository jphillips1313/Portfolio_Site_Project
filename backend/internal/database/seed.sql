BEGIN;

TRUNCATE education, skills, projects CASCADE;

-- EDUCATION ENTRIES

INSERT INTO
    education (
        degree,
        institution,
        field_of_study,
        start_date,
        end_date,
        grade,
        description,
        slug,
        display_order
    )
VALUES (
        'MSc Software Engineering', -- e.g., 'MSc Software Engineering'
        'Cardiff University', -- e.g., 'University of Birmingham'
        'Software Engineering', -- e.g., 'Software Engineering'
        '2025-09-22', -- Start date
        NULL, -- End date (or NULL if current)
        'Ongoing', -- e.g., 'Distinction', 'First Class', '3.8 GPA'
        'Conversion Course into software engineering',
        'msc-software', -- URL-friendly slug
        1 -- Display order (1 = most recent)
    ),
    (
        'BSc Physics with hons',
        'University of Salford',
        'Physics',
        '2020-09-18',
        '2024-05-14',
        '2:2',
        'Physics degree, with a dissertation in High pressure physics',
        'bsc-physics',
        2
    );

-- ============================================
-- MODULES
-- ============================================

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Web Development', -- e.g., 'Advanced Web Development'
    'CMT652', -- e.g., 'CS-501' (or NULL)
    'Ongoing', -- e.g., 'A+', '85%', 'Pass'
    15, -- Credit hours
    1, -- Semester number
    'Basics of web development and serverside working',
    jsonb_build_object (
        'topics',
        jsonb_build_array ('HTML', 'CSS', 'Spring'),
        'projects',
        jsonb_build_array ('Observatory client project'),
        'assessment',
        'Coursework surrounding 2 hackathons and Client Project'
    )
FROM education e
WHERE
    e.slug = 'msc-software';
-- Match the slug from your degree

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Programming Principles and practice', -- e.g., 'Advanced Web Development'
    'CMT653', -- e.g., 'CS-501' (or NULL)
    'Ongoing', -- e.g., 'A+', '85%', 'Pass'
    15, -- Credit hours
    1, -- Semester number
    'Introduction to Java and different programming paradigms',
    jsonb_build_object (
        'topics',
        jsonb_build_array (
            'Java',
            'Object Oriented',
            'Unit Testing'
        ),
        'projects',
        jsonb_build_array (
            'Booking system',
            'Observatory Client Project'
        ),
        'assessment',
        'Coursework building a command line booking system and aspects of the Client project'
    )
FROM education e
WHERE
    e.slug = 'msc-software';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Agile Software Development', -- e.g., 'Advanced Web Development'
    'CMT651', -- e.g., 'CS-501' (or NULL)
    'Ongoing', -- e.g., 'A+', '85%', 'Pass'
    15, -- Credit hours
    1, -- Semester number
    'Basics of Agile working, SCRUM, INVEST, user stories etc. effective use of Git',
    jsonb_build_object (
        'topics',
        jsonb_build_array (
            'SCRUM',
            'User Stories',
            'Git'
        ),
        'projects',
        jsonb_build_array ('Observatory client project'),
        'assessment',
        'Coursework surronding Agile working in Client project'
    )
FROM education e
WHERE
    e.slug = 'msc-software';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'DevOps', -- e.g., 'Advanced Web Development'
    'CMT654', -- e.g., 'CS-501' (or NULL)
    'N/a', -- e.g., 'A+', '85%', 'Pass'
    15, -- Credit hours
    2, -- Semester number
    'Not delivered yet',
    jsonb_build_object (
        'topics',
        jsonb_build_array ('topic 1'),
        'projects',
        jsonb_build_array ('project 1'),
        'assessment',
        'N/A'
    )
FROM education e
WHERE
    e.slug = 'msc-software';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Delivering User Experience', -- e.g., 'Advanced Web Development'
    'CMT656', -- e.g., 'CS-501' (or NULL)
    'N/a', -- e.g., 'A+', '85%', 'Pass'
    15, -- Credit hours
    2, -- Semester number
    'Not delivered yet',
    jsonb_build_object (
        'topics',
        jsonb_build_array ('topic 1'),
        'projects',
        jsonb_build_array ('project 1'),
        'assessment',
        'N/A'
    )
FROM education e
WHERE
    e.slug = 'msc-software';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Manipulating and exploiting data', -- e.g., 'Advanced Web Development'
    'CMT655', -- e.g., 'CS-501' (or NULL)
    'N/a', -- e.g., 'A+', '85%', 'Pass'
    15, -- Credit hours
    2, -- Semester number
    'Not delivered yet',
    jsonb_build_object (
        'topics',
        jsonb_build_array ('topic 1'),
        'projects',
        jsonb_build_array ('project 1'),
        'assessment',
        'N/A'
    )
FROM education e
WHERE
    e.slug = 'msc-software';

-- Year 1 (Level 3) - 20/21
INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Foundation Mathematics 1',
    'G1000014',
    '76',
    20,
    1,
    'Foundation mathematics module covering core mathematical concepts.',
    jsonb_build_object (
        'academic_year',
        '2020/21',
        'year_of_study',
        1
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Foundation Mathematics 2',
    'G1000015',
    '93',
    20,
    1,
    'Advanced foundation mathematics building on core concepts.',
    jsonb_build_object (
        'academic_year',
        '2020/21',
        'year_of_study',
        1
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Foundation Physics A',
    'F3000015',
    '77',
    20,
    1,
    'Introduction to fundamental physics principles and concepts.',
    jsonb_build_object (
        'academic_year',
        '2020/21',
        'year_of_study',
        1
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Foundation Physics B',
    'F3000016',
    '65',
    20,
    1,
    'Continuation of fundamental physics principles.',
    jsonb_build_object (
        'academic_year',
        '2020/21',
        'year_of_study',
        1
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Foundation Physics Laboratory',
    'F3000017',
    '41',
    20,
    1,
    'Practical laboratory work in physics.',
    jsonb_build_object (
        'academic_year',
        '2020/21',
        'year_of_study',
        1
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Foundation IT and Study Skills',
    'F3000018',
    '40',
    20,
    1,
    'IT skills and study techniques for physics students.',
    jsonb_build_object (
        'academic_year',
        '2020/21',
        'year_of_study',
        1
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

-- Year 2 (Level 4) - 21/22
INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Mechanics, Relativity and Quantum Physics',
    'F30010036',
    '74',
    20,
    2,
    'Core concepts in mechanics, special relativity, and quantum physics.',
    jsonb_build_object (
        'academic_year',
        '2021/22',
        'year_of_study',
        2
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Electricity, Magnetism and Light',
    'F30010037',
    '60',
    20,
    2,
    'Electromagnetic theory and optics.',
    jsonb_build_object (
        'academic_year',
        '2021/22',
        'year_of_study',
        2
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Modelling of Physical Systems',
    'F30010038',
    '47',
    20,
    2,
    'Mathematical and computational modeling of physical systems.',
    jsonb_build_object (
        'academic_year',
        '2021/22',
        'year_of_study',
        2
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Mathematics',
    'F30010039',
    '80',
    20,
    2,
    'Advanced mathematics for physics applications.',
    jsonb_build_object (
        'academic_year',
        '2021/22',
        'year_of_study',
        2
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Physics in Context',
    'F30010040',
    '57',
    20,
    2,
    'Applications of physics in real-world contexts.',
    jsonb_build_object (
        'academic_year',
        '2021/22',
        'year_of_study',
        2
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Physics Laboratory 1',
    'F30010041',
    '57',
    20,
    2,
    'Practical laboratory experiments in physics.',
    jsonb_build_object (
        'academic_year',
        '2021/22',
        'year_of_study',
        2
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

-- Year 3 (Level 5) - 22/23
INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Physics Laboratory 2',
    'F30020041',
    '47',
    20,
    3,
    'Advanced laboratory experiments and techniques.',
    jsonb_build_object (
        'academic_year',
        '2022/23',
        'year_of_study',
        3
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Group Project',
    'F30020045',
    '47',
    20,
    3,
    'Collaborative physics research project.',
    jsonb_build_object (
        'academic_year',
        '2022/23',
        'year_of_study',
        3
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Electromagnetism',
    'F30020040',
    '40',
    20,
    3,
    'Advanced electromagnetic theory and applications.',
    jsonb_build_object (
        'academic_year',
        '2022/23',
        'year_of_study',
        3
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Thermal Physics',
    'F30020042',
    '44',
    20,
    3,
    'Thermodynamics and statistical mechanics.',
    jsonb_build_object (
        'academic_year',
        '2022/23',
        'year_of_study',
        3
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Quantum Physics',
    'F30020043',
    '50',
    20,
    3,
    'Advanced quantum mechanics and applications.',
    jsonb_build_object (
        'academic_year',
        '2022/23',
        'year_of_study',
        3
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Waves & Optics',
    'F30020044',
    '32',
    20,
    3,
    'Wave phenomena and optical physics.',
    jsonb_build_object (
        'academic_year',
        '2022/23',
        'year_of_study',
        3
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

-- Year 4 (Level 6) - 23/24
INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Nuclear & Particle Physics',
    'F30030091',
    '33',
    20,
    4,
    'Study of nuclear structure and particle physics.',
    jsonb_build_object (
        'academic_year',
        '2023/24',
        'year_of_study',
        4
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Physics Laboratory 3',
    'F30030095',
    '70',
    20,
    4,
    'Final year advanced laboratory work.',
    jsonb_build_object (
        'academic_year',
        '2023/24',
        'year_of_study',
        4
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Condensed Matter Physics',
    'F30030094',
    '55',
    20,
    4,
    'Physics of solids and condensed matter systems.',
    jsonb_build_object (
        'academic_year',
        '2023/24',
        'year_of_study',
        4
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

INSERT INTO
    modules (
        education_id,
        name,
        code,
        grade,
        credits,
        semester,
        description,
        detailed_content
    )
SELECT
    e.id,
    'Astrophysics and Planetary Physics',
    'F30030096',
    '50',
    20,
    4,
    'Physics of celestial bodies and planetary systems.',
    jsonb_build_object (
        'academic_year',
        '2023/24',
        'year_of_study',
        4
    )
FROM education e
WHERE
    e.slug = 'bsc-physics';

-- Repeat for more modules...

-- ============================================
-- SKILLS
-- ============================================
-- Add the tech stack from this project + any other skills
-- We'll let you fill in proficiency_level and dates

INSERT INTO
    skills (
        name,
        category,
        proficiency_level,
        years_experience,
        status,
        first_learned_date,
        icon
    )
VALUES
    -- Backend (from portfolio project)
    (
        'Go',
        'Backend',
        75,
        1,
        'active',
        2024 / 12 / 01,
        'code'
    ),
    (
        'PostgreSQL',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'database'
    ),
    (
        'Redis',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'server'
    ),
    (
        'Fiber',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'zap'
    ),
    (
        'sqlx',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'database'
    ),
    (
        'REST APIs',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'network'
    ),
    (
        'Docker',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'container'
    ),
    (
        'Spring',
        'Backend',
        NULL,
        NULL,
        'active',
        NULL,
        'leaf'
    ),

-- Frontend (from portfolio project + MSc)
(
    'HTML',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'code'
),
(
    'CSS',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'palette'
),
(
    'JavaScript',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'code'
),
(
    'TypeScript',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'code'
),
(
    'React',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'layout'
),
(
    'Next.js',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'zap'
),
(
    'Tailwind CSS',
    'Frontend',
    NULL,
    NULL,
    'active',
    NULL,
    'palette'
),

-- Languages (from MSc + Physics)
(
    'Java',
    'Languages',
    NULL,
    NULL,
    'active',
    NULL,
    'code'
),
(
    'Python',
    'Languages',
    NULL,
    NULL,
    'active',
    NULL,
    'code'
),

-- Data & Scientific Computing (from Physics)
( 'MATLAB', 'Data', NULL, NULL, 'active', NULL, 'calculator' ),

-- Tools & Methodologies
(
    'Git',
    'Tools',
    NULL,
    NULL,
    'active',
    NULL,
    'git-branch'
),
(
    'Agile/SCRUM',
    'Tools',
    NULL,
    NULL,
    'active',
    NULL,
    'users'
),
(
    'Unit Testing',
    'Tools',
    NULL,
    NULL,
    'active',
    NULL,
    'check-circle'
);

-- ============================================
-- PROJECTS
-- ============================================
-- Add your portfolio projects

INSERT INTO
    projects (
        name,
        slug,
        short_description,
        full_description,
        status,
        start_date,
        end_date,
        github_url,
        live_url,
        featured,
        difficulty_level,
        image_url
    )
VALUES (
        'Full-Stack Portfolio Site',
        'portfolio-site',
        'Production-ready portfolio site with Go backend, PostgreSQL database, and Next.js frontend',
        'A comprehensive portfolio platform built from scratch to showcase professional work and document continuous learning. The backend features a RESTful API built with Go and Fiber framework, PostgreSQL database with 12 normalized tables, Redis caching, and proper database design including UUID primary keys, JSONB fields, and automated triggers. The frontend uses Next.js 15 with TypeScript, Tailwind CSS, and modern React patterns. Key features include dynamic content management, interactive CV with nested module details, blog system with tagging and series support, universal content linking system connecting projects to skills and blog posts, and analytics tracking. The project demonstrates full-stack development skills, database architecture, API design, and modern web development practices.',
        'active',
        '2025-12-10',
        NULL,
        NULL, -- Add your GitHub URL when you push it
        NULL, -- Add when deployed
        true,
        'intermediate',
        NULL
    );

-- Template for future projects (delete or fill in when you have more)
-- INSERT INTO projects (name, slug, short_description, full_description, status, start_date, end_date, github_url, live_url, featured, difficulty, thumbnail_url) VALUES
-- (
--   'PROJECT_NAME',
--   'project-slug',
--   'One sentence description',
--   'Full description with technical details, challenges, and learnings.',
--   'completed',
--   '2025-01-01',
--   '2025-02-01',
--   'https://github.com/yourname/project',
--   'https://project.com',
--   false,
--   'beginner',
--   NULL
-- );

-- ============================================
-- PROJECT SKILLS (Links projects to skills)
-- ============================================
-- Connect the portfolio project to its tech stack

INSERT INTO
    project_skills (
        project_id,
        skill_id,
        is_primary
    )
SELECT p.id, s.id, true -- is_primary (core technology)
FROM projects p
    CROSS JOIN skills s
WHERE
    p.slug = 'portfolio-site'
    AND s.name IN (
        'Go',
        'PostgreSQL',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'React'
    );

INSERT INTO
    project_skills (
        project_id,
        skill_id,
        is_primary
    )
SELECT p.id, s.id, false -- Secondary technologies
FROM projects p
    CROSS JOIN skills s
WHERE
    p.slug = 'portfolio-site'
    AND s.name IN (
        'Redis',
        'Docker',
        'REST APIs',
        'Fiber',
        'sqlx'
    );

-- ============================================
-- BLOG POSTS
-- ============================================
-- Add blog posts explaining your learning journey

-- ============================================
-- BLOG POSTS
-- ============================================
-- Template for future blog posts (no mock data)

-- INSERT INTO blog_posts (title, slug, excerpt, content, status, published_at, reading_time, series_name, series_order) VALUES
-- (
--   'BLOG_POST_TITLE',
--   'blog-post-slug',
--   'Short excerpt (1-2 sentences) describing what this post is about.',
--   '# Full Markdown Content
--
-- Your actual blog post content here in markdown format...
--
-- ## Section 1
-- Content...
--
-- ## Section 2
-- More content...
-- ',
--   'published',                -- or 'draft'
--   '2025-12-15',               -- Published date (NULL for drafts)
--   5,                          -- Reading time in minutes
--   'Series Name',              -- Series name (or NULL if standalone)
--   1                           -- Part number in series (or NULL)
-- );

-- ============================================
-- BLOG TAGS
-- ============================================
-- Template for blog tags (add when you create blog posts)

-- INSERT INTO blog_tags (name, slug) VALUES
-- ('Go', 'go'),
-- ('PostgreSQL', 'postgresql'),
-- ('Next.js', 'nextjs'),
-- ('Backend', 'backend'),
-- ('Frontend', 'frontend'),
-- ('Tutorial', 'tutorial'),
-- ('Learning', 'learning');

-- ============================================
-- BLOG POST TAGS (Links posts to tags)
-- ============================================
-- Template for linking posts to tags

-- INSERT INTO blog_post_tags (blog_post_id, blog_tag_id)
-- SELECT
--   bp.id,
--   bt.id
-- FROM blog_posts bp
-- CROSS JOIN blog_tags bt
-- WHERE bp.slug = 'your-post-slug'
--   AND bt.name IN ('Tag1', 'Tag2', 'Tag3');

-- ============================================
-- CONTENT LINKS
-- ============================================
-- Link everything together (projects ↔ blog ↔ skills)
-- Add these as you create blog posts and want to connect content

-- Example: Link blog post to project
-- INSERT INTO content_links (from_type, from_id, to_type, to_id, relationship)
-- SELECT
--   'blog_post',
--   bp.id,
--   'project',
--   p.id,
--   'discusses'
-- FROM blog_posts bp
-- CROSS JOIN projects p
-- WHERE bp.slug = 'your-blog-post-slug'
--   AND p.slug = 'portfolio-site';

-- Example: Link project to skills it demonstrates
-- INSERT INTO content_links (from_type, from_id, to_type, to_id, relationship)
-- SELECT
--   'project',
--   p.id,
--   'skill',
--   s.id,
--   'demonstrates'
-- FROM projects p
-- CROSS JOIN skills s
-- WHERE p.slug = 'portfolio-site'
--   AND s.name IN ('Go', 'PostgreSQL', 'REST APIs');

-- ============================================
-- LEARNING GOALS (Optional)
-- ============================================
-- Track your learning progress

-- INSERT INTO learning_goals (goal, skill_id, status, started_at, achieved_at, notes)
-- SELECT
--   'Master Go concurrency patterns',
--   s.id,
--   'in_progress',
--   '2025-12-01',
--   NULL,
--   'Working through Go concurrency patterns in side projects'
-- FROM skills s WHERE s.name = 'Go';

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after loading to verify data:

-- SELECT COUNT(*) as education_count FROM education;
-- SELECT COUNT(*) as modules_count FROM modules;
-- SELECT COUNT(*) as skills_count FROM skills;
-- SELECT COUNT(*) as projects_count FROM projects;
-- SELECT COUNT(*) as blog_posts_count FROM blog_posts;
-- SELECT * FROM projects WHERE featured = true;
