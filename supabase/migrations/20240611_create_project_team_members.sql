-- Create project_team_members junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Enable row level security
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting
DROP POLICY IF EXISTS "Anyone can select project_team_members" ON project_team_members;
CREATE POLICY "Anyone can select project_team_members"
    ON project_team_members
    FOR SELECT
    USING (true);

-- Create policy for inserting
DROP POLICY IF EXISTS "Authenticated users can insert project_team_members" ON project_team_members;
CREATE POLICY "Authenticated users can insert project_team_members"
    ON project_team_members
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for updating
DROP POLICY IF EXISTS "Authenticated users can update project_team_members" ON project_team_members;
CREATE POLICY "Authenticated users can update project_team_members"
    ON project_team_members
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

-- Create policy for deleting
DROP POLICY IF EXISTS "Authenticated users can delete project_team_members" ON project_team_members;
CREATE POLICY "Authenticated users can delete project_team_members"
    ON project_team_members
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE project_team_members;
