
export interface FamilyMember {
  id: string;
  user_id: string;
  family_id: string;
  role: string;
  created_at: string;
}

export interface FamilyUnit {
  id: string;
  created_at: string;
}

export interface FamilyData {
  family_id: string;
  family_units?: FamilyUnit;
  family_members?: FamilyMember[];
}
