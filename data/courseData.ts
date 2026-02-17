// Comprehensive University of Guelph Engineering Course Data
// This data powers: Academic Tree, Tasks, Reminders, Grading, Weekly Checklists, Performance Tracking

export interface CourseOutline {
  code: string;
  name: string;
  credits: number;
  semester: 'Fall' | 'Winter' | 'Summer' | 'Fall/Winter';
  
  // Course Description
  description: string;
  prerequisites?: string[];
  corequisites?: string[];
  restrictions?: string[];
  
  // Course Structure
  lectureHours: number;
  labHours: number;
  weeklyHours: number;
  
  // Learning Outcomes
  learningObjectives: string[];
  
  // Assessment Structure (for grading system)
  assessments: {
    type: 'Assignment' | 'Midterm' | 'Final Exam' | 'Lab' | 'Project' | 'Quiz' | 'Participation';
    name: string;
    weight: number; // percentage
    dueWeek?: number; // which week it's typically due
    isRecurring?: boolean; // for weekly labs, assignments
    frequency?: string; // e.g., "Weekly", "Bi-weekly"
  }[];
  
  // Weekly Topics (for weekly checklists)
  weeklyTopics: {
    week: number;
    topics: string[];
    readings?: string[];
    tasks?: string[]; // Default tasks for the week
  }[];
  
  // Important Dates & Milestones (for reminders)
  milestones: {
    type: 'Midterm' | 'Project Due' | 'Final Exam' | 'Lab Report' | 'Assignment';
    name: string;
    typicalWeek: number;
    description: string;
  }[];
  
  // Textbook & Resources
  textbooks?: {
    title: string;
    author: string;
    required: boolean;
  }[];
  
  // Program associations
  requiredFor: string[]; // Which engineering programs require this
  electiveFor?: string[]; // Which programs can take as elective
}

// ============================================
// FIRST YEAR ENGINEERING COURSES
// ============================================

export const ENGG_COURSES: { [key: string]: CourseOutline } = {
  'ENGG*1070': {
    code: 'ENGG*1070',
    name: 'Occupational Health and Safety',
    credits: 0.25,
    semester: 'Fall',
    description: 'This course covers the legal implications and statutes governing occupational health and safety. Topics include safety methodology, workplace hazards, noise levels, biosafety, hazardous waste management, and radiation safety.',
    prerequisites: [],
    restrictions: ['Restricted to BENG and BENG:C students'],
    lectureHours: 2,
    labHours: 0,
    weeklyHours: 2,
    learningObjectives: [
      'Understand legal implications of occupational health and safety',
      'Identify workplace hazards and implement safety protocols',
      'Apply safety methodology in engineering contexts',
      'Manage hazardous materials and waste properly',
      'Understand biosafety and radiation safety requirements'
    ],
    assessments: [
      { type: 'Quiz', name: 'Safety Quizzes', weight: 30, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Safety Report', weight: 30, dueWeek: 8 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Occupational Health and Safety', 'Legal Framework'], tasks: ['Read safety regulations', 'Complete safety orientation'] },
      { week: 2, topics: ['Workplace Hazards', 'Risk Assessment'], tasks: ['Complete hazard identification assignment'] },
      { week: 3, topics: ['Noise Levels and Control'], tasks: ['Noise assessment case study'] },
      { week: 4, topics: ['Chemical Safety', 'WHMIS'], tasks: ['WHMIS certification quiz'] },
      { week: 5, topics: ['Biosafety Principles'], tasks: ['Biosafety protocol review'] },
      { week: 6, topics: ['Hazardous Waste Management'], tasks: ['Waste management plan assignment'] },
      { week: 7, topics: ['Radiation Safety'], tasks: ['Radiation safety quiz'] },
      { week: 8, topics: ['Personal Protective Equipment'], tasks: ['PPE selection assignment'] },
      { week: 9, topics: ['Emergency Response'], tasks: ['Emergency procedure review'] },
      { week: 10, topics: ['Safety Management Systems'], tasks: ['Safety audit case study'] },
      { week: 11, topics: ['Incident Investigation'], tasks: ['Incident report analysis'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Complete practice exam'] }
    ],
    milestones: [
      { type: 'Assignment', name: 'Safety Report Due', typicalWeek: 8, description: 'Comprehensive workplace safety analysis report' },
      { type: 'Final Exam', name: 'Final Examination', typicalWeek: 12, description: 'Cumulative exam covering all safety topics' }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*1100': {
    code: 'ENGG*1100',
    name: 'Engineering and Design I',
    credits: 0.75,
    semester: 'Fall',
    description: 'Introduction to the engineering design process including open-ended design projects. Topics include engineering drawings, professional ethics, teamwork, and communication. Team-based coursework with design projects.',
    prerequisites: [],
    restrictions: ['Restricted to BENG and BENG:C students'],
    lectureHours: 2,
    labHours: 4,
    weeklyHours: 6,
    learningObjectives: [
      'Apply engineering design process to open-ended problems',
      'Create and interpret engineering drawings',
      'Work effectively in engineering teams',
      'Communicate technical information clearly',
      'Understand professional ethics in engineering',
      'Use computer-aided design (CAD) tools'
    ],
    assessments: [
      { type: 'Lab', name: 'Weekly Lab Reports', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'CAD Assignments', weight: 15, isRecurring: true },
      { type: 'Project', name: 'Midterm Design Project', weight: 25, dueWeek: 7 },
      { type: 'Project', name: 'Final Design Project', weight: 30, dueWeek: 12 },
      { type: 'Participation', name: 'Team Participation', weight: 10 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Engineering Design', 'Design Process Overview'], tasks: ['Form project teams', 'Design process worksheet'] },
      { week: 2, topics: ['Engineering Drawings Fundamentals', 'Orthographic Projections'], tasks: ['Lab: Basic sketching exercises', 'CAD tutorial'] },
      { week: 3, topics: ['CAD Software Introduction', 'Dimensioning and Tolerancing'], tasks: ['Lab: CAD assignment 1', 'Drawing standards quiz'] },
      { week: 4, topics: ['Problem Definition', 'Requirements Analysis'], tasks: ['Lab: Define design problem', 'Requirements document'] },
      { week: 5, topics: ['Concept Generation', 'Brainstorming Techniques'], tasks: ['Lab: Concept sketches', 'Concept evaluation matrix'] },
      { week: 6, topics: ['Design Analysis', 'Feasibility Studies'], tasks: ['Lab: Prototype development', 'Feasibility report'] },
      { week: 7, topics: ['Midterm Project Presentations', 'Peer Review'], tasks: ['Midterm project submission', 'Presentation'] },
      { week: 8, topics: ['Advanced CAD Techniques', 'Assembly Drawings'], tasks: ['Lab: Complex CAD model', 'Assembly drawing'] },
      { week: 9, topics: ['Professional Ethics in Engineering'], tasks: ['Ethics case study', 'Professional responsibility quiz'] },
      { week: 10, topics: ['Technical Communication', 'Report Writing'], tasks: ['Lab: Final project work', 'Progress report'] },
      { week: 11, topics: ['Design Optimization', 'Final Project Work'], tasks: ['Lab: Project refinement', 'Final CAD models'] },
      { week: 12, topics: ['Final Project Presentations', 'Course Review'], tasks: ['Final project submission', 'Team presentation'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'Midterm Design Project', typicalWeek: 7, description: 'First major design project with presentation' },
      { type: 'Project Due', name: 'Final Design Project', typicalWeek: 12, description: 'Comprehensive design project with CAD models and documentation' }
    ],
    textbooks: [
      { title: 'Engineering Design: A Project-Based Introduction', author: 'Dym, C.L. and Little, P.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*1210': {
    code: 'ENGG*1210',
    name: 'Engineering Mechanics I',
    credits: 0.5,
    semester: 'Winter',
    description: 'Introduction to Newtonian mechanics including free body diagrams, equilibrium of rigid bodies, structural analysis, particle dynamics, and conservation of energy and momentum.',
    prerequisites: ['MATH*1200', 'PHYS*1130'],
    restrictions: ['Priority access for BENG and BENG:C students'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply Newton\'s laws to engineering problems',
      'Draw and analyze free body diagrams',
      'Solve equilibrium problems for rigid bodies',
      'Analyze simple structures and trusses',
      'Apply principles of particle dynamics',
      'Use energy and momentum conservation principles'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Reports', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Mechanics', 'Units and Vectors', 'Force Systems'], tasks: ['Assignment 1: Vector operations', 'Review calculus'] },
      { week: 2, topics: ['Free Body Diagrams', 'Equilibrium of Particles'], tasks: ['Assignment 2: FBD practice', 'Lab: Force measurements'] },
      { week: 3, topics: ['Equilibrium of Rigid Bodies', 'Support Reactions'], tasks: ['Assignment 3: Equilibrium problems', 'Lab: Beam reactions'] },
      { week: 4, topics: ['Structural Analysis', 'Method of Joints'], tasks: ['Assignment 4: Truss analysis', 'Lab: Truss testing'] },
      { week: 5, topics: ['Method of Sections', 'Frames and Machines'], tasks: ['Assignment 5: Complex structures', 'Midterm review'] },
      { week: 6, topics: ['Friction', 'Applications'], tasks: ['Assignment 6: Friction problems', 'Lab: Friction experiments'] },
      { week: 7, topics: ['Midterm Exam', 'Kinematics of Particles'], tasks: ['Midterm exam', 'Review for second half'] },
      { week: 8, topics: ['Rectilinear Motion', 'Curvilinear Motion'], tasks: ['Assignment 7: Kinematics', 'Lab: Motion analysis'] },
      { week: 9, topics: ['Newton\'s Second Law', 'Kinetics of Particles'], tasks: ['Assignment 8: Dynamics problems', 'Lab: Force and acceleration'] },
      { week: 10, topics: ['Work and Energy', 'Conservative Forces'], tasks: ['Assignment 9: Energy methods', 'Lab: Energy conservation'] },
      { week: 11, topics: ['Impulse and Momentum', 'Impact'], tasks: ['Assignment 10: Momentum problems', 'Lab: Collision experiments'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Complete practice problems', 'Final exam review session'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Examination', typicalWeek: 7, description: 'Covers statics portion of course' },
      { type: 'Final Exam', name: 'Final Examination', typicalWeek: 12, description: 'Comprehensive exam covering entire course' }
    ],
    textbooks: [
      { title: 'Engineering Mechanics: Statics and Dynamics', author: 'Hibbeler, R.C.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*1500': {
    code: 'ENGG*1500',
    name: 'Engineering Analysis',
    credits: 0.5,
    semester: 'Fall/Winter',
    description: 'Mathematical techniques for engineering analysis including vectors, matrices, differential equations, and numerical methods. Applications to engineering problems.',
    prerequisites: ['MATH*1200'],
    restrictions: ['Restricted to BENG students'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply vector and matrix operations to engineering problems',
      'Solve systems of linear equations',
      'Use differential equations in engineering analysis',
      'Apply numerical methods for approximation',
      'Use MATLAB or similar software for analysis',
      'Interpret and visualize engineering data'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Problem Sets', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Computer Labs', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Engineering Analysis', 'MATLAB Basics'], tasks: ['Install MATLAB', 'Tutorial exercises'] },
      { week: 2, topics: ['Vectors and Vector Operations', 'Dot and Cross Products'], tasks: ['Assignment 1: Vector problems', 'Lab: MATLAB vectors'] },
      { week: 3, topics: ['Matrices', 'Matrix Operations'], tasks: ['Assignment 2: Matrix operations', 'Lab: Matrix computations'] },
      { week: 4, topics: ['Systems of Linear Equations', 'Gaussian Elimination'], tasks: ['Assignment 3: Linear systems', 'Lab: Solving equations'] },
      { week: 5, topics: ['Eigenvalues and Eigenvectors'], tasks: ['Assignment 4: Eigenvalue problems', 'Lab: Applications'] },
      { week: 6, topics: ['First-Order Differential Equations'], tasks: ['Assignment 5: ODEs', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Higher-Order ODEs'], tasks: ['Midterm exam', 'Lab: ODE solutions'] },
      { week: 8, topics: ['Laplace Transforms'], tasks: ['Assignment 6: Laplace transforms', 'Lab: Transform methods'] },
      { week: 9, topics: ['Numerical Methods', 'Root Finding'], tasks: ['Assignment 7: Numerical methods', 'Lab: Newton-Raphson'] },
      { week: 10, topics: ['Numerical Integration', 'Differentiation'], tasks: ['Assignment 8: Integration methods', 'Lab: Numerical calculus'] },
      { week: 11, topics: ['Curve Fitting', 'Data Analysis'], tasks: ['Assignment 9: Regression analysis', 'Lab: Data fitting'] },
      { week: 12, topics: ['Review', 'Final Exam Preparation'], tasks: ['Complete review problems', 'Practice exam'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Covers vectors, matrices, and linear systems' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive exam including all topics' }
    ],
    textbooks: [
      { title: 'Advanced Engineering Mathematics', author: 'Kreyszig, E.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  }
  },

  'ENGG*2100': {
    code: 'ENGG*2100',
    name: 'Engineering and Design II',
    credits: 0.75,
    semester: 'Fall',
    description: 'Continuation of engineering design process with more complex open-ended projects. Focus on design analysis, optimization, and professional practice.',
    prerequisites: ['ENGG*1100'],
    restrictions: ['Restricted to BENG students'],
    lectureHours: 2,
    labHours: 4,
    weeklyHours: 6,
    learningObjectives: [
      'Apply advanced design methodologies',
      'Perform design optimization and analysis',
      'Manage complex engineering projects',
      'Present technical designs professionally',
      'Understand sustainability in design'
    ],
    assessments: [
      { type: 'Lab', name: 'Weekly Lab Work', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Project', name: 'Design Project 1', weight: 30, dueWeek: 6 },
      { type: 'Project', name: 'Final Design Project', weight: 40, dueWeek: 12 },
      { type: 'Participation', name: 'Team Participation', weight: 10 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Advanced Design Methodology', 'Project Introduction'], tasks: ['Form teams', 'Project brainstorming'] },
      { week: 2, topics: ['Design for Manufacturing', 'Material Selection'], tasks: ['Lab: Material analysis', 'Design constraints report'] },
      { week: 3, topics: ['Design Optimization', 'Cost Analysis'], tasks: ['Lab: Optimization exercise', 'Cost estimation'] },
      { week: 4, topics: ['Sustainability in Engineering', 'Life Cycle Analysis'], tasks: ['Lab: LCA study', 'Sustainability report'] },
      { week: 5, topics: ['Project Management', 'Gantt Charts'], tasks: ['Lab: Project planning', 'Create project schedule'] },
      { week: 6, topics: ['Project 1 Presentations'], tasks: ['Submit Design Project 1', 'Peer reviews'] },
      { week: 7, topics: ['Failure Analysis', 'Safety Factors'], tasks: ['Lab: Failure modes analysis', 'Safety assessment'] },
      { week: 8, topics: ['Prototype Development', 'Testing'], tasks: ['Lab: Build prototype', 'Testing plan'] },
      { week: 9, topics: ['Design Documentation', 'Technical Writing'], tasks: ['Lab: CAD documentation', 'Design report draft'] },
      { week: 10, topics: ['Quality Assurance', 'Standards'], tasks: ['Lab: Quality testing', 'Standards compliance check'] },
      { week: 11, topics: ['Final Project Work', 'Refinement'], tasks: ['Lab: Final adjustments', 'Practice presentation'] },
      { week: 12, topics: ['Final Presentations'], tasks: ['Submit final project', 'Final presentation'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'Design Project 1', typicalWeek: 6, description: 'First major design deliverable with analysis' },
      { type: 'Project Due', name: 'Final Design Project', typicalWeek: 12, description: 'Complete design with prototype and documentation' }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*2120': {
    code: 'ENGG*2120',
    name: 'Material Science',
    credits: 0.5,
    semester: 'Fall',
    description: 'Introduction to material science including atomic structure, bonding, crystal structures, phase diagrams, mechanical properties, and material selection for engineering applications.',
    prerequisites: ['CHEM*1040'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Understand atomic structure and bonding in materials',
      'Analyze crystal structures and defects',
      'Interpret phase diagrams',
      'Evaluate mechanical properties of materials',
      'Select appropriate materials for engineering applications',
      'Understand heat treatment processes'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 15, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Materials', 'Atomic Structure'], tasks: ['Assignment 1: Atomic bonding', 'Lab: Material classification'] },
      { week: 2, topics: ['Crystal Structures', 'Unit Cells'], tasks: ['Assignment 2: Crystal systems', 'Lab: Crystal models'] },
      { week: 3, topics: ['Imperfections in Solids', 'Point and Line Defects'], tasks: ['Assignment 3: Defect calculations', 'Lab: Microstructure observation'] },
      { week: 4, topics: ['Diffusion', 'Fick\'s Laws'], tasks: ['Assignment 4: Diffusion problems', 'Lab: Diffusion experiments'] },
      { week: 5, topics: ['Mechanical Properties', 'Stress-Strain Behavior'], tasks: ['Assignment 5: Stress-strain analysis', 'Lab: Tensile testing'] },
      { week: 6, topics: ['Dislocations and Strengthening', 'Work Hardening'], tasks: ['Assignment 6: Strengthening mechanisms', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Failure Mechanisms'], tasks: ['Midterm exam', 'Lab: Fracture analysis'] },
      { week: 8, topics: ['Phase Diagrams', 'Binary Systems'], tasks: ['Assignment 7: Phase diagram interpretation', 'Lab: Cooling curves'] },
      { week: 9, topics: ['Iron-Carbon System', 'Steel'], tasks: ['Assignment 8: Steel compositions', 'Lab: Heat treatment'] },
      { week: 10, topics: ['Heat Treatment', 'TTT Diagrams'], tasks: ['Assignment 9: Heat treatment design', 'Lab: Hardness testing'] },
      { week: 11, topics: ['Material Selection', 'Engineering Materials'], tasks: ['Assignment 10: Material selection project', 'Lab: Material comparison'] },
      { week: 12, topics: ['Review and Exam Preparation'], tasks: ['Complete review problems', 'Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Covers atomic structure through mechanical properties' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive exam including all material' }
    ],
    textbooks: [
      { title: 'Materials Science and Engineering: An Introduction', author: 'Callister, W.D. and Rethwisch, D.G.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*2160': {
    code: 'ENGG*2160',
    name: 'Engineering Mechanics II - Dynamics',
    credits: 0.5,
    semester: 'Fall',
    description: 'Dynamics of particles and rigid bodies including kinematics, kinetics, work-energy methods, impulse-momentum, and vibrations.',
    prerequisites: ['ENGG*1210', 'MATH*1210'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Analyze kinematics of particles in various coordinate systems',
      'Apply Newton\'s laws to dynamic systems',
      'Use work-energy methods for dynamic analysis',
      'Apply impulse-momentum principles',
      'Analyze rigid body motion',
      'Understand basic vibration principles'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Problem Sets', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Reports', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Review of Kinematics', 'Rectilinear Motion'], tasks: ['Assignment 1: Kinematics review', 'Lab: Motion sensors'] },
      { week: 2, topics: ['Curvilinear Motion', 'Rectangular Coordinates'], tasks: ['Assignment 2: Projectile motion', 'Lab: Trajectory analysis'] },
      { week: 3, topics: ['Normal-Tangential Coordinates', 'Polar Coordinates'], tasks: ['Assignment 3: Circular motion', 'Lab: Centripetal force'] },
      { week: 4, topics: ['Relative Motion', 'Dependent Motion'], tasks: ['Assignment 4: Relative velocity', 'Lab: Constraint analysis'] },
      { week: 5, topics: ['Kinetics: Force and Acceleration'], tasks: ['Assignment 5: F=ma problems', 'Lab: Force measurements'] },
      { week: 6, topics: ['Work and Energy', 'Power'], tasks: ['Assignment 6: Energy methods', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Conservation of Energy'], tasks: ['Midterm exam', 'Lab: Energy experiments'] },
      { week: 8, topics: ['Impulse and Momentum', 'Conservation of Momentum'], tasks: ['Assignment 7: Impact problems', 'Lab: Collisions'] },
      { week: 9, topics: ['Planar Kinematics of Rigid Bodies'], tasks: ['Assignment 8: Rigid body motion', 'Lab: Rotation analysis'] },
      { week: 10, topics: ['Planar Kinetics of Rigid Bodies'], tasks: ['Assignment 9: Moment of inertia', 'Lab: Rotational dynamics'] },
      { week: 11, topics: ['Vibrations', 'Free and Forced Vibration'], tasks: ['Assignment 10: Vibration analysis', 'Lab: Oscillation experiments'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Final review session'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Covers particle dynamics' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including rigid body dynamics' }
    ],
    textbooks: [
      { title: 'Engineering Mechanics: Dynamics', author: 'Hibbeler, R.C.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*2230': {
    code: 'ENGG*2230',
    name: 'Fluid Mechanics',
    credits: 0.5,
    semester: 'Fall',
    description: 'Fundamentals of fluid mechanics including fluid statics, fluid dynamics, conservation laws, pipe flow, and boundary layers.',
    prerequisites: ['ENGG*1210', 'MATH*2270'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Apply fluid properties in engineering calculations',
      'Analyze fluid statics and pressure distributions',
      'Apply conservation of mass, momentum, and energy',
      'Solve pipe flow and friction problems',
      'Understand boundary layer concepts',
      'Perform experimental fluid measurements'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Reports', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Fluids', 'Fluid Properties'], tasks: ['Assignment 1: Properties', 'Lab: Viscosity measurement'] },
      { week: 2, topics: ['Fluid Statics', 'Pressure Distribution'], tasks: ['Assignment 2: Hydrostatics', 'Lab: Manometry'] },
      { week: 3, topics: ['Forces on Submerged Surfaces'], tasks: ['Assignment 3: Hydrostatic forces', 'Lab: Pressure on surfaces'] },
      { week: 4, topics: ['Buoyancy and Stability'], tasks: ['Assignment 4: Buoyancy problems', 'Lab: Stability experiments'] },
      { week: 5, topics: ['Conservation of Mass', 'Continuity Equation'], tasks: ['Assignment 5: Flow analysis', 'Lab: Flow visualization'] },
      { week: 6, topics: ['Bernoulli Equation', 'Energy Grade Line'], tasks: ['Assignment 6: Bernoulli applications', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Momentum Equation'], tasks: ['Midterm exam', 'Lab: Force from jets'] },
      { week: 8, topics: ['Pipe Flow', 'Friction Factors'], tasks: ['Assignment 7: Pipe systems', 'Lab: Pipe friction'] },
      { week: 9, topics: ['Minor Losses', 'Pipe Networks'], tasks: ['Assignment 8: Complex piping', 'Lab: Flow meters'] },
      { week: 10, topics: ['Boundary Layers', 'Drag'], tasks: ['Assignment 9: Drag calculations', 'Lab: Drag measurements'] },
      { week: 11, topics: ['Dimensional Analysis', 'Similarity'], tasks: ['Assignment 10: Scaling laws', 'Lab: Model testing'] },
      { week: 12, topics: ['Review and Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Covers fluid statics and basic dynamics' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive exam all topics' }
    ],
    textbooks: [
      { title: 'Fluid Mechanics: Fundamentals and Applications', author: 'Cengel, Y.A. and Cimbala, J.M.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Civil Engineering', 'Environmental Engineering', 'Water Resources Engineering'],
    electiveFor: []
  },

  'ENGG*2400': {
    code: 'ENGG*2400',
    name: 'Engineering Systems Analysis',
    credits: 0.5,
    semester: 'Fall',
    description: 'Mathematical modeling and analysis of engineering systems. Topics include differential equations, Laplace transforms, transfer functions, and system response.',
    prerequisites: ['MATH*2270', 'ENGG*1500'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Model engineering systems mathematically',
      'Solve differential equations for system analysis',
      'Use Laplace transforms for system analysis',
      'Analyze transfer functions',
      'Determine system response to various inputs',
      'Use MATLAB for systems analysis'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Computer Labs', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['System Modeling', 'Block Diagrams'], tasks: ['Assignment 1: System models', 'Lab: MATLAB review'] },
      { week: 2, topics: ['First-Order Systems', 'Time Response'], tasks: ['Assignment 2: First-order response', 'Lab: Simulations'] },
      { week: 3, topics: ['Second-Order Systems', 'Damping'], tasks: ['Assignment 3: Second-order systems', 'Lab: Step response'] },
      { week: 4, topics: ['Laplace Transform Review', 'Properties'], tasks: ['Assignment 4: Laplace problems', 'Lab: Transform applications'] },
      { week: 5, topics: ['Transfer Functions', 'System Representation'], tasks: ['Assignment 5: Transfer functions', 'Lab: System identification'] },
      { week: 6, topics: ['Frequency Response', 'Bode Plots'], tasks: ['Assignment 6: Bode analysis', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Stability Analysis'], tasks: ['Midterm exam', 'Lab: Stability testing'] },
      { week: 8, topics: ['Routh-Hurwitz Criterion', 'Root Locus'], tasks: ['Assignment 7: Stability problems', 'Lab: Root locus plots'] },
      { week: 9, topics: ['State-Space Representation'], tasks: ['Assignment 8: State-space models', 'Lab: State-space analysis'] },
      { week: 10, topics: ['Feedback Control Systems'], tasks: ['Assignment 9: Control design', 'Lab: Controller simulation'] },
      { week: 11, topics: ['System Response Analysis', 'Performance Metrics'], tasks: ['Assignment 10: Performance analysis', 'Lab: Optimization'] },
      { week: 12, topics: ['Review and Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Covers system modeling and time response' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive exam all material' }
    ],
    textbooks: [
      { title: 'System Dynamics and Response', author: 'Palm, W.J.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*2180': {
    code: 'ENGG*2180',
    name: 'Introduction to Manufacturing Processes',
    credits: 0.5,
    semester: 'Winter',
    description: 'Introduction to manufacturing processes including casting, forming, machining, joining, and quality control.',
    prerequisites: ['ENGG*2120'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Understand various manufacturing processes',
      'Select appropriate manufacturing methods',
      'Analyze manufacturing costs and efficiency',
      'Apply quality control principles',
      'Understand material processing',
      'Use manufacturing equipment safely'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 30, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Process Analysis', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Manufacturing', 'Material Properties'], tasks: ['Assignment 1: Manufacturing overview', 'Lab: Material testing'] },
      { week: 2, topics: ['Casting Processes', 'Sand Casting'], tasks: ['Assignment 2: Casting design', 'Lab: Sand casting'] },
      { week: 3, topics: ['Metal Forming', 'Forging and Rolling'], tasks: ['Assignment 3: Forming processes', 'Lab: Metal forming'] },
      { week: 4, topics: ['Sheet Metal Working', 'Deep Drawing'], tasks: ['Assignment 4: Sheet metal', 'Lab: Stamping'] },
      { week: 5, topics: ['Machining Fundamentals', 'Turning and Milling'], tasks: ['Assignment 5: Machining', 'Lab: CNC introduction'] },
      { week: 6, topics: ['Drilling and Grinding', 'Tool Materials'], tasks: ['Assignment 6: Tool selection', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Joining Processes'], tasks: ['Midterm exam', 'Lab: Welding'] },
      { week: 8, topics: ['Welding', 'Brazing and Soldering'], tasks: ['Assignment 7: Joining methods', 'Lab: Weld testing'] },
      { week: 9, topics: ['Plastic Processing', 'Injection Molding'], tasks: ['Assignment 8: Plastics', 'Lab: Injection molding'] },
      { week: 10, topics: ['Additive Manufacturing', '3D Printing'], tasks: ['Assignment 9: AM technologies', 'Lab: 3D printing'] },
      { week: 11, topics: ['Quality Control', 'Inspection Methods'], tasks: ['Assignment 10: Quality assurance', 'Lab: Measurement systems'] },
      { week: 12, topics: ['Manufacturing Economics', 'Final Review'], tasks: ['Cost analysis project', 'Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Casting through machining' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive all processes' }
    ],
    textbooks: [
      { title: 'Manufacturing Processes for Engineering Materials', author: 'Kalpakjian, S. and Schmid, S.R.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Mechatronics'],
    electiveFor: ['All Engineering Programs']
  },

  'ENGG*2340': {
    code: 'ENGG*2340',
    name: 'Kinematics and Dynamics',
    credits: 0.5,
    semester: 'Winter',
    description: 'Analysis of mechanisms and machine dynamics including kinematics of mechanisms, velocity and acceleration analysis, and dynamic forces.',
    prerequisites: ['ENGG*2160'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Analyze kinematics of mechanisms',
      'Calculate velocities and accelerations in mechanisms',
      'Apply dynamic analysis to machines',
      'Design linkages and cams',
      'Understand gear and gear train kinematics',
      'Analyze balancing of rotating machinery'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Problem Sets', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Reports', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Mechanisms', 'Degrees of Freedom'], tasks: ['Assignment 1: DOF calculations', 'Lab: Mechanism models'] },
      { week: 2, topics: ['Position Analysis', 'Loop-Closure Equations'], tasks: ['Assignment 2: Position analysis', 'Lab: Linkage design'] },
      { week: 3, topics: ['Velocity Analysis', 'Instant Centers'], tasks: ['Assignment 3: Velocity problems', 'Lab: Velocity measurements'] },
      { week: 4, topics: ['Acceleration Analysis'], tasks: ['Assignment 4: Acceleration', 'Lab: Acceleration analysis'] },
      { week: 5, topics: ['Four-Bar Linkages', 'Grashof Condition'], tasks: ['Assignment 5: Linkage design', 'Lab: Four-bar mechanism'] },
      { week: 6, topics: ['Cams', 'Cam Design'], tasks: ['Assignment 6: Cam profiles', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Gears'], tasks: ['Midterm exam', 'Lab: Gear systems'] },
      { week: 8, topics: ['Gear Trains', 'Gear Ratios'], tasks: ['Assignment 7: Gear trains', 'Lab: Gear analysis'] },
      { week: 9, topics: ['Static Force Analysis'], tasks: ['Assignment 8: Forces in mechanisms', 'Lab: Force measurement'] },
      { week: 10, topics: ['Dynamic Force Analysis', 'Inertia Forces'], tasks: ['Assignment 9: Dynamic forces', 'Lab: Dynamic testing'] },
      { week: 11, topics: ['Balancing', 'Rotating and Reciprocating Machinery'], tasks: ['Assignment 10: Balancing', 'Lab: Balancing experiment'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Kinematics through cams' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including dynamics' }
    ],
    textbooks: [
      { title: 'Theory of Machines and Mechanisms', author: 'Shigley, J.E. and Uicker, J.J.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Mechatronics'],
    electiveFor: []
  },

  'ENGG*2410': {
    code: 'ENGG*2410',
    name: 'Digital Systems Design',
    credits: 0.5,
    semester: 'Fall',
    description: 'Introduction to digital logic design including combinational and sequential circuits, hardware description languages, and FPGA implementation.',
    prerequisites: ['PHYS*1010'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Design combinational logic circuits',
      'Design sequential logic circuits',
      'Use hardware description languages (Verilog/VHDL)',
      'Implement designs on FPGAs',
      'Analyze timing and performance',
      'Debug digital systems'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Assignments', weight: 35, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Design Assignments', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Number Systems', 'Boolean Algebra'], tasks: ['Assignment 1: Number conversions', 'Lab: Logic gates'] },
      { week: 2, topics: ['Logic Gates', 'Truth Tables'], tasks: ['Assignment 2: Boolean simplification', 'Lab: Gate implementations'] },
      { week: 3, topics: ['Combinational Logic Design', 'Karnaugh Maps'], tasks: ['Assignment 3: K-maps', 'Lab: Combinational circuits'] },
      { week: 4, topics: ['Decoders, Encoders, Multiplexers'], tasks: ['Assignment 4: MSI devices', 'Lab: Decoder design'] },
      { week: 5, topics: ['Arithmetic Circuits', 'Adders'], tasks: ['Assignment 5: Arithmetic logic', 'Lab: Adder implementation'] },
      { week: 6, topics: ['Sequential Circuits', 'Flip-Flops'], tasks: ['Assignment 6: Flip-flops', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Registers and Counters'], tasks: ['Midterm exam', 'Lab: Counter design'] },
      { week: 8, topics: ['State Machines', 'FSM Design'], tasks: ['Assignment 7: State machines', 'Lab: FSM implementation'] },
      { week: 9, topics: ['HDL Introduction', 'Verilog/VHDL'], tasks: ['Assignment 8: HDL coding', 'Lab: HDL simulation'] },
      { week: 10, topics: ['FPGA Implementation', 'Synthesis'], tasks: ['Assignment 9: FPGA design', 'Lab: FPGA programming'] },
      { week: 11, topics: ['Timing Analysis', 'Optimization'], tasks: ['Assignment 10: Timing constraints', 'Lab: Design optimization'] },
      { week: 12, topics: ['Final Project', 'Review'], tasks: ['Complete digital system project', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Combinational and sequential logic' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including HDL and FPGA' }
    ],
    textbooks: [
      { title: 'Digital Design', author: 'Mano, M.M. and Ciletti, M.D.', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing', 'Mechatronics'],
    electiveFor: ['Mechanical Engineering']
  },

  'ENGG*2420': {
    code: 'ENGG*2420',
    name: 'Analog and Digital Electronics',
    credits: 0.5,
    semester: 'Winter',
    description: 'Introduction to analog and digital electronic circuits including diodes, transistors, amplifiers, and digital logic.',
    prerequisites: ['ENGG*2450'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Analyze diode and transistor circuits',
      'Design amplifier circuits',
      'Understand operational amplifier applications',
      'Design digital logic circuits',
      'Interface analog and digital systems',
      'Build and test electronic circuits'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 30, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Circuit Design Assignments', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Semiconductor Physics', 'PN Junctions'], tasks: ['Assignment 1: Semiconductors', 'Lab: Diode characteristics'] },
      { week: 2, topics: ['Diode Circuits', 'Rectifiers'], tasks: ['Assignment 2: Rectifier design', 'Lab: Power supplies'] },
      { week: 3, topics: ['Bipolar Junction Transistors', 'BJT Operation'], tasks: ['Assignment 3: BJT biasing', 'Lab: Transistor circuits'] },
      { week: 4, topics: ['BJT Amplifiers', 'Common Emitter'], tasks: ['Assignment 4: Amplifier design', 'Lab: CE amplifier'] },
      { week: 5, topics: ['Field Effect Transistors', 'MOSFET'], tasks: ['Assignment 5: FET circuits', 'Lab: MOSFET testing'] },
      { week: 6, topics: ['Operational Amplifiers', 'Op-Amp Applications'], tasks: ['Assignment 6: Op-amp circuits', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Active Filters'], tasks: ['Midterm exam', 'Lab: Filter design'] },
      { week: 8, topics: ['Digital Logic', 'TTL and CMOS'], tasks: ['Assignment 7: Logic families', 'Lab: Logic gates'] },
      { week: 9, topics: ['Combinational Logic', 'Logic Design'], tasks: ['Assignment 8: Logic design', 'Lab: Combinational circuits'] },
      { week: 10, topics: ['Sequential Logic', 'Flip-Flops'], tasks: ['Assignment 9: Sequential design', 'Lab: Counter circuits'] },
      { week: 11, topics: ['Analog-Digital Conversion', 'DAC and ADC'], tasks: ['Assignment 10: Converters', 'Lab: ADC/DAC'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Circuit troubleshooting'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Analog electronics through op-amps' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive analog and digital' }
    ],
    textbooks: [
      { title: 'Microelectronic Circuits', author: 'Sedra, A.S. and Smith, K.C.', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: ['Mechanical Engineering']
  },

  'ENGG*2550': {
    code: 'ENGG*2550',
    name: 'Engineering Materials',
    credits: 0.5,
    semester: 'Fall',
    description: 'Advanced study of engineering materials including metals, polymers, ceramics, and composites with applications to material selection.',
    prerequisites: ['ENGG*2120'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Understand material structure-property relationships',
      'Select materials for engineering applications',
      'Analyze material failure mechanisms',
      'Understand material processing effects',
      'Apply materials testing techniques',
      'Evaluate material performance'
    ],
    assessments: [
      { type: 'Assignment', name: 'Material Selection Projects', weight: 25, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Material Classification', 'Selection Criteria'], tasks: ['Assignment 1: Material properties', 'Lab: Material identification'] },
      { week: 2, topics: ['Metals and Alloys', 'Steel'], tasks: ['Assignment 2: Alloy selection', 'Lab: Metallography'] },
      { week: 3, topics: ['Aluminum Alloys', 'Non-Ferrous Metals'], tasks: ['Assignment 3: Al alloys', 'Lab: Heat treatment'] },
      { week: 4, topics: ['Mechanical Testing', 'Stress-Strain'], tasks: ['Assignment 4: Testing analysis', 'Lab: Tensile testing'] },
      { week: 5, topics: ['Fracture Mechanics', 'Fatigue'], tasks: ['Assignment 5: Fatigue analysis', 'Lab: Fatigue testing'] },
      { week: 6, topics: ['Creep', 'High Temperature Behavior'], tasks: ['Assignment 6: Creep design', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Polymers'], tasks: ['Midterm exam', 'Lab: Polymer testing'] },
      { week: 8, topics: ['Polymer Properties', 'Thermoplastics'], tasks: ['Assignment 7: Polymer selection', 'Lab: Polymer processing'] },
      { week: 9, topics: ['Ceramics', 'Ceramic Properties'], tasks: ['Assignment 8: Ceramics', 'Lab: Ceramic characterization'] },
      { week: 10, topics: ['Composites', 'Fiber-Reinforced Materials'], tasks: ['Assignment 9: Composite design', 'Lab: Composite testing'] },
      { week: 11, topics: ['Material Selection Methodology', 'Ashby Charts'], tasks: ['Assignment 10: Selection project', 'Lab: Material database'] },
      { week: 12, topics: ['Sustainable Materials', 'Final Review'], tasks: ['Sustainability analysis', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Metals and mechanical behavior' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'All material classes' }
    ],
    textbooks: [
      { title: 'Materials Selection in Mechanical Design', author: 'Ashby, M.F.', required: true }
    ],
    requiredFor: ['Civil Engineering'],
    electiveFor: ['Mechanical Engineering', 'Biomedical Engineering']
  },

  'ENGG*2560': {
    code: 'ENGG*2560',
    name: 'Chemistry for Environmental Engineers',
    credits: 0.5,
    semester: 'Winter',
    description: 'Chemistry principles for environmental engineering including water chemistry, air pollution chemistry, and environmental analysis.',
    prerequisites: ['CHEM*1050'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Apply chemistry to environmental systems',
      'Analyze water quality parameters',
      'Understand air pollution chemistry',
      'Perform environmental chemical analysis',
      'Apply chemical equilibria to natural systems',
      'Understand contaminant fate and transport'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 30, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Problem Sets', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Environmental Chemistry Overview', 'Chemical Equilibria'], tasks: ['Assignment 1: Equilibrium', 'Lab: pH measurements'] },
      { week: 2, topics: ['Acid-Base Chemistry', 'Carbonate System'], tasks: ['Assignment 2: Acid-base', 'Lab: Alkalinity testing'] },
      { week: 3, topics: ['Redox Chemistry', 'Oxidation States'], tasks: ['Assignment 3: Redox reactions', 'Lab: DO measurements'] },
      { week: 4, topics: ['Water Chemistry', 'Hardness'], tasks: ['Assignment 4: Water quality', 'Lab: Hardness testing'] },
      { week: 5, topics: ['Dissolved Oxygen', 'BOD and COD'], tasks: ['Assignment 5: Oxygen demand', 'Lab: BOD analysis'] },
      { week: 6, topics: ['Nutrients in Water', 'Nitrogen and Phosphorus'], tasks: ['Assignment 6: Nutrients', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Heavy Metals'], tasks: ['Midterm exam', 'Lab: Metal analysis'] },
      { week: 8, topics: ['Organic Contaminants', 'Pesticides'], tasks: ['Assignment 7: Organics', 'Lab: Extraction methods'] },
      { week: 9, topics: ['Air Pollution Chemistry', 'Atmospheric Reactions'], tasks: ['Assignment 8: Air chemistry', 'Lab: Air sampling'] },
      { week: 10, topics: ['Soil Chemistry', 'Sorption'], tasks: ['Assignment 9: Soil analysis', 'Lab: Soil testing'] },
      { week: 11, topics: ['Environmental Analysis', 'Spectroscopy'], tasks: ['Assignment 10: Analytical methods', 'Lab: Spectrophotometry'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Water chemistry fundamentals' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive environmental chemistry' }
    ],
    textbooks: [
      { title: 'Environmental Chemistry', author: 'Manahan, S.E.', required: true }
    ],
    requiredFor: ['Environmental Engineering', 'Water Resources Engineering'],
    electiveFor: ['Biological Engineering']
  },

  'ENGG*2450': {
    code: 'ENGG*2450',
    name: 'Electric Circuits',
    credits: 0.5,
    semester: 'Winter',
    description: 'Fundamentals of electric circuits including DC and AC circuit analysis, resistive circuits, capacitors, inductors, operational amplifiers, and first-order circuits.',
    prerequisites: ['PHYS*1010', 'MATH*2270'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Analyze DC and AC circuits using Kirchhoff\'s laws',
      'Apply nodal and mesh analysis techniques',
      'Understand capacitor and inductor behavior',
      'Analyze operational amplifier circuits',
      'Solve first-order RC and RL circuits',
      'Perform circuit measurements and troubleshooting'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Problem Sets', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Reports', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Circuit Elements', 'Ohm\'s Law', 'Power'], tasks: ['Assignment 1: Basic circuits', 'Lab: Breadboarding basics'] },
      { week: 2, topics: ['Kirchhoff\'s Laws', 'Series-Parallel Circuits'], tasks: ['Assignment 2: KVL/KCL problems', 'Lab: Circuit analysis'] },
      { week: 3, topics: ['Nodal Analysis'], tasks: ['Assignment 3: Nodal method', 'Lab: Multi-loop circuits'] },
      { week: 4, topics: ['Mesh Analysis'], tasks: ['Assignment 4: Mesh method', 'Lab: Mesh current'] },
      { week: 5, topics: ['Thevenin and Norton Equivalents'], tasks: ['Assignment 5: Circuit theorems', 'Lab: Equivalent circuits'] },
      { week: 6, topics: ['Operational Amplifiers', 'Op-Amp Circuits'], tasks: ['Assignment 6: Op-amp problems', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Capacitors'], tasks: ['Midterm exam', 'Lab: Capacitor circuits'] },
      { week: 8, topics: ['Inductors', 'Magnetic Circuits'], tasks: ['Assignment 7: Inductors', 'Lab: Inductor measurements'] },
      { week: 9, topics: ['First-Order RC Circuits', 'Time Response'], tasks: ['Assignment 8: RC circuits', 'Lab: Transient response'] },
      { week: 10, topics: ['First-Order RL Circuits'], tasks: ['Assignment 9: RL circuits', 'Lab: RL transients'] },
      { week: 11, topics: ['AC Circuits', 'Phasors'], tasks: ['Assignment 10: AC analysis', 'Lab: AC measurements'] },
      { week: 12, topics: ['Review and Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Covers DC circuit analysis' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive exam including transients and AC' }
    ],
    textbooks: [
      { title: 'Fundamentals of Electric Circuits', author: 'Alexander, C.K. and Sadiku, M.N.O.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  }
  ,

  // ============================================
  // THIRD YEAR ENGINEERING COURSES
  // ============================================

  'ENGG*3050': {
    code: 'ENGG*3050',
    name: 'Engineering Economics',
    credits: 0.5,
    semester: 'Fall',
    description: 'Economic analysis for engineering decision making including time value of money, depreciation, and project evaluation.',
    prerequisites: [],
    lectureHours: 3,
    labHours: 0,
    weeklyHours: 3,
    learningObjectives: [
      'Apply time value of money concepts',
      'Evaluate engineering projects economically',
      'Understand depreciation methods',
      'Perform cost-benefit analysis',
      'Make engineering economic decisions',
      'Analyze risk and uncertainty'
    ],
    assessments: [
      { type: 'Assignment', name: 'Problem Sets', weight: 30, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 30, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Time Value of Money', 'Interest Formulas'], tasks: ['Assignment 1: TVM problems'] },
      { week: 2, topics: ['Present Worth Analysis'], tasks: ['Assignment 2: PW calculations'] },
      { week: 3, topics: ['Annual Worth Analysis'], tasks: ['Assignment 3: AW problems'] },
      { week: 4, topics: ['Rate of Return Analysis'], tasks: ['Assignment 4: ROR calculations'] },
      { week: 5, topics: ['Benefit-Cost Analysis'], tasks: ['Assignment 5: B/C ratio'] },
      { week: 6, topics: ['Depreciation'], tasks: ['Assignment 6: Depreciation methods', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam'] },
      { week: 8, topics: ['Replacement Analysis'], tasks: ['Assignment 7: Replacement decisions'] },
      { week: 9, topics: ['Inflation Effects'], tasks: ['Assignment 8: Inflation analysis'] },
      { week: 10, topics: ['Risk and Uncertainty'], tasks: ['Assignment 9: Risk analysis'] },
      { week: 11, topics: ['Project Evaluation'], tasks: ['Assignment 10: Project comparison'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'TVM through depreciation' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive economics' }
    ],
    textbooks: [
      { title: 'Engineering Economy', author: 'Sullivan, W.G. et al.', required: true }
    ],
    requiredFor: ['Biomedical Engineering', 'Biological Engineering'],
    electiveFor: ['All Engineering Programs']
  },

  'ENGG*3070': {
    code: 'ENGG*3070',
    name: 'Integrated Manufacturing Systems',
    credits: 0.5,
    semester: 'Fall',
    description: 'Principles of integrated manufacturing systems including automation, robotics, and computer-integrated manufacturing.',
    prerequisites: ['ENGG*2180'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Understand manufacturing system integration',
      'Apply automation principles',
      'Understand robotics in manufacturing',
      'Use CIM concepts',
      'Analyze production systems',
      'Optimize manufacturing processes'
    ],
    assessments: [
      { type: 'Assignment', name: 'System Design Assignments', weight: 25, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 20, isRecurring: true },
      { type: 'Project', name: 'Manufacturing System Project', weight: 25, dueWeek: 11 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Manufacturing Systems Overview'], tasks: ['Assignment 1: System analysis', 'Lab: Tour manufacturing facility'] },
      { week: 2, topics: ['Automation Fundamentals'], tasks: ['Assignment 2: Automation design', 'Lab: Automation demo'] },
      { week: 3, topics: ['Industrial Robotics'], tasks: ['Assignment 3: Robot programming', 'Lab: Robot simulation'] },
      { week: 4, topics: ['CNC Systems'], tasks: ['Assignment 4: CNC programming', 'Lab: CNC machining'] },
      { week: 5, topics: ['Material Handling'], tasks: ['Assignment 5: Material flow', 'Lab: Conveyors'] },
      { week: 6, topics: ['Quality Control Systems'], tasks: ['Project work', 'Lab: Inspection systems'] },
      { week: 7, topics: ['Computer-Integrated Manufacturing'], tasks: ['Assignment 6: CIM design', 'Lab: CIM simulation'] },
      { week: 8, topics: ['Production Planning'], tasks: ['Assignment 7: Scheduling', 'Project progress'] },
      { week: 9, topics: ['Flexible Manufacturing Systems'], tasks: ['Assignment 8: FMS design', 'Lab: FMS simulation'] },
      { week: 10, topics: ['Lean Manufacturing'], tasks: ['Assignment 9: Lean principles', 'Project work'] },
      { week: 11, topics: ['Project Presentations'], tasks: ['Project submission', 'Presentation'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'Manufacturing System Project', typicalWeek: 11, description: 'Design integrated manufacturing system' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Manufacturing systems concepts' }
    ],
    textbooks: [
      { title: 'Automation, Production Systems, and CIM', author: 'Groover, M.P.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Mechanical Engineering', 'Engineering Systems and Computing']
  },

  'ENGG*3080': {
    code: 'ENGG*3080',
    name: 'Energy Resources and Technologies',
    credits: 0.5,
    semester: 'Winter',
    description: 'Survey of energy resources and conversion technologies including fossil fuels, nuclear, and renewable energy.',
    prerequisites: ['ENGG*2100'],
    lectureHours: 3,
    labHours: 0,
    weeklyHours: 3,
    learningObjectives: [
      'Understand various energy resources',
      'Analyze energy conversion systems',
      'Evaluate renewable energy technologies',
      'Assess environmental impacts',
      'Apply energy efficiency principles',
      'Understand energy policy'
    ],
    assessments: [
      { type: 'Assignment', name: 'Energy Analysis Assignments', weight: 30, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 30, dueWeek: 7 },
      { type: 'Project', name: 'Energy System Analysis', weight: 20, dueWeek: 11 },
      { type: 'Final Exam', name: 'Final Exam', weight: 20, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Energy Fundamentals', 'Global Energy Picture'], tasks: ['Assignment 1: Energy consumption analysis'] },
      { week: 2, topics: ['Fossil Fuels', 'Coal and Oil'], tasks: ['Assignment 2: Fossil fuel assessment'] },
      { week: 3, topics: ['Natural Gas', 'Power Plants'], tasks: ['Assignment 3: Power generation'] },
      { week: 4, topics: ['Nuclear Energy'], tasks: ['Assignment 4: Nuclear systems'] },
      { week: 5, topics: ['Hydroelectric Power'], tasks: ['Assignment 5: Hydro analysis'] },
      { week: 6, topics: ['Wind Energy'], tasks: ['Assignment 6: Wind assessment', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Solar Energy'], tasks: ['Midterm exam'] },
      { week: 8, topics: ['Solar Thermal and PV'], tasks: ['Assignment 7: Solar design'] },
      { week: 9, topics: ['Biomass and Biofuels'], tasks: ['Assignment 8: Bioenergy'] },
      { week: 10, topics: ['Geothermal and Ocean Energy'], tasks: ['Project work'] },
      { week: 11, topics: ['Energy Storage', 'Smart Grids'], tasks: ['Project submission'] },
      { week: 12, topics: ['Energy Policy', 'Review'], tasks: ['Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Conventional energy sources' },
      { type: 'Project Due', name: 'Energy System Analysis', typicalWeek: 11, description: 'Analyze energy system design' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive energy topics' }
    ],
    textbooks: [
      { title: 'Energy Resources and Technologies', author: 'Boyle, G.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Mechanical Engineering', 'Environmental Engineering']
  },

  'ENGG*3100': {
    code: 'ENGG*3100',
    name: 'Engineering and Design III',
    credits: 0.75,
    semester: 'Winter',
    description: 'Team-based engineering design project course focusing on multidisciplinary design problems.',
    prerequisites: ['ENGG*2100'],
    lectureHours: 2,
    labHours: 4,
    weeklyHours: 6,
    learningObjectives: [
      'Lead multidisciplinary design projects',
      'Apply systems engineering principles',
      'Manage project resources and schedules',
      'Present technical information professionally',
      'Work in diverse engineering teams',
      'Consider societal and environmental impacts'
    ],
    assessments: [
      { type: 'Project', name: 'Design Project', weight: 60, dueWeek: 12 },
      { type: 'Presentation', name: 'Progress Presentations', weight: 20, isRecurring: true },
      { type: 'Participation', name: 'Team Participation', weight: 20 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Project Introduction', 'Team Formation'], tasks: ['Form teams', 'Project selection'] },
      { week: 2, topics: ['Requirements Analysis', 'Stakeholder Identification'], tasks: ['Requirements document'] },
      { week: 3, topics: ['Concept Generation'], tasks: ['Concept sketches', 'Evaluation matrix'] },
      { week: 4, topics: ['Preliminary Design'], tasks: ['Design calculations', 'Progress presentation 1'] },
      { week: 5, topics: ['Design Analysis'], tasks: ['Analysis report'] },
      { week: 6, topics: ['Detailed Design'], tasks: ['CAD models', 'Detailed drawings'] },
      { week: 7, topics: ['Prototyping'], tasks: ['Build prototype', 'Progress presentation 2'] },
      { week: 8, topics: ['Testing and Validation'], tasks: ['Test protocol', 'Test results'] },
      { week: 9, topics: ['Design Optimization'], tasks: ['Refinement', 'Cost analysis'] },
      { week: 10, topics: ['Impact Assessment'], tasks: ['Environmental/social impact', 'Progress presentation 3'] },
      { week: 11, topics: ['Final Documentation'], tasks: ['Final report', 'Presentation preparation'] },
      { week: 12, topics: ['Final Presentations'], tasks: ['Final presentation', 'Project submission'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'Design Project', typicalWeek: 12, description: 'Complete multidisciplinary design with documentation' }
    ],
    textbooks: [
      { title: 'Engineering Design: A Systematic Approach', author: 'Pahl, G. and Beitz, W.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'ENGG*3120': {
    code: 'ENGG*3120',
    name: 'Computer Aided Design and Manufacturing',
    credits: 0.75,
    semester: 'Fall',
    description: 'Advanced CAD/CAM techniques including solid modeling, FEA, and CNC programming.',
    prerequisites: ['ENGG*1100'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Create complex 3D models',
      'Perform finite element analysis',
      'Generate CNC programs',
      'Use CAM software',
      'Optimize designs using CAE',
      'Integrate CAD and manufacturing'
    ],
    assessments: [
      { type: 'Lab', name: 'CAD Assignments', weight: 40, isRecurring: true },
      { type: 'Project', name: 'CAD/CAM Project', weight: 35, dueWeek: 11 },
      { type: 'Final Exam', name: 'Final Exam', weight: 25, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Advanced Solid Modeling'], tasks: ['Lab: Complex parts', 'Parametric design'] },
      { week: 2, topics: ['Assembly Modeling'], tasks: ['Lab: Assembly constraints', 'Motion studies'] },
      { week: 3, topics: ['Surface Modeling'], tasks: ['Lab: Complex surfaces', 'Lofts and sweeps'] },
      { week: 4, topics: ['FEA Introduction'], tasks: ['Lab: Static analysis', 'Mesh generation'] },
      { week: 5, topics: ['Thermal and Dynamic Analysis'], tasks: ['Lab: Advanced FEA', 'Analysis report'] },
      { week: 6, topics: ['Design Optimization'], tasks: ['Lab: Parametric optimization'] },
      { week: 7, topics: ['CAM Fundamentals'], tasks: ['Lab: Toolpath generation'] },
      { week: 8, topics: ['CNC Programming'], tasks: ['Lab: G-code programming', 'CNC simulation'] },
      { week: 9, topics: ['Manufacturing Simulation'], tasks: ['Lab: Process simulation', 'Project work'] },
      { week: 10, topics: ['Rapid Prototyping'], tasks: ['Lab: 3D printing', 'Project work'] },
      { week: 11, topics: ['Project Completion'], tasks: ['Project submission', 'Presentation'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'CAD/CAM Project', typicalWeek: 11, description: 'Complete part design with CAM programming' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'CAD/CAM concepts' }
    ],
    textbooks: [
      { title: 'CAD/CAM: Principles and Applications', author: 'Groover, M.P.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Mechanical Engineering']
  },

  'ENGG*3140': {
    code: 'ENGG*3140',
    name: 'Mechanical Vibration',
    credits: 0.5,
    semester: 'Fall',
    description: 'Analysis of mechanical vibrations including free and forced vibrations, damping, and multi-degree-of-freedom systems.',
    prerequisites: ['ENGG*2340', 'MATH*2270'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Analyze single-DOF vibration systems',
      'Calculate natural frequencies and mode shapes',
      'Understand damping effects',
      'Analyze forced vibrations',
      'Use vibration measurement equipment',
      'Design vibration isolation systems'
    ],
    assessments: [
      { type: 'Assignment', name: 'Problem Sets', weight: 30, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Vibrations', 'Harmonic Motion'], tasks: ['Assignment 1: Harmonic motion'] },
      { week: 2, topics: ['Free Vibration - Undamped'], tasks: ['Assignment 2: Natural frequency', 'Lab: Pendulum experiment'] },
      { week: 3, topics: ['Free Vibration - Damped'], tasks: ['Assignment 3: Damped vibration', 'Lab: Damping measurement'] },
      { week: 4, topics: ['Forced Vibration - Harmonic'], tasks: ['Assignment 4: Resonance'] },
      { week: 5, topics: ['Vibration Isolation'], tasks: ['Assignment 5: Isolation design', 'Lab: Isolation testing'] },
      { week: 6, topics: ['Rotating Unbalance'], tasks: ['Assignment 6: Balancing', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam'] },
      { week: 8, topics: ['Two-DOF Systems'], tasks: ['Assignment 7: 2-DOF analysis', 'Lab: Coupled oscillators'] },
      { week: 9, topics: ['Multi-DOF Systems'], tasks: ['Assignment 8: Matrix methods'] },
      { week: 10, topics: ['Modal Analysis'], tasks: ['Assignment 9: Mode shapes', 'Lab: Modal testing'] },
      { week: 11, topics: ['Continuous Systems'], tasks: ['Assignment 10: Beam vibrations'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Single-DOF systems' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive vibrations' }
    ],
    textbooks: [
      { title: 'Mechanical Vibrations', author: 'Rao, S.S.', required: true }
    ],
    requiredFor: ['Mechanical Engineering'],
    electiveFor: ['Mechatronics']
  },

  'ENGG*3150': {
    code: 'ENGG*3150',
    name: 'Engineering Biomechanics',
    credits: 0.5,
    semester: 'Fall',
    description: 'Application of mechanics principles to biological systems including human musculoskeletal system.',
    prerequisites: ['ENGG*2160'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply mechanics to biological systems',
      'Analyze musculoskeletal biomechanics',
      'Understand tissue mechanics',
      'Perform gait analysis',
      'Use biomechanical instrumentation',
      'Design biomedical devices'
    ],
    assessments: [
      { type: 'Assignment', name: 'Biomechanics Problems', weight: 25, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Biomechanics'], tasks: ['Assignment 1: Biomechanics overview'] },
      { week: 2, topics: ['Bone Mechanics'], tasks: ['Assignment 2: Bone stress analysis', 'Lab: Bone testing'] },
      { week: 3, topics: ['Soft Tissue Mechanics'], tasks: ['Assignment 3: Tissue properties', 'Lab: Tensile testing'] },
      { week: 4, topics: ['Joint Mechanics'], tasks: ['Assignment 4: Joint forces'] },
      { week: 5, topics: ['Muscle Mechanics'], tasks: ['Assignment 5: Muscle models', 'Lab: EMG measurement'] },
      { week: 6, topics: ['Gait Analysis'], tasks: ['Assignment 6: Gait biomechanics', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam', 'Lab: Gait lab'] },
      { week: 8, topics: ['Cardiovascular Biomechanics'], tasks: ['Assignment 7: Hemodynamics'] },
      { week: 9, topics: ['Respiratory Biomechanics'], tasks: ['Assignment 8: Lung mechanics'] },
      { week: 10, topics: ['Injury Biomechanics'], tasks: ['Assignment 9: Impact analysis', 'Lab: Impact testing'] },
      { week: 11, topics: ['Prosthetics and Orthotics'], tasks: ['Assignment 10: Device design'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Tissue and joint mechanics' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive biomechanics' }
    ],
    textbooks: [
      { title: 'Biomechanics and Motor Control of Human Movement', author: 'Winter, D.A.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Biomedical Engineering', 'Mechanical Engineering']
  },

  'ENGG*3170': {
    code: 'ENGG*3170',
    name: 'Biomaterials',
    credits: 0.5,
    semester: 'Winter',
    description: 'Materials for biomedical applications including metals, polymers, ceramics, and composites.',
    prerequisites: ['ENGG*2120'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Understand biomaterial properties',
      'Select materials for biomedical devices',
      'Analyze biocompatibility',
      'Understand tissue-material interactions',
      'Test biomaterials',
      'Apply regulatory requirements'
    ],
    assessments: [
      { type: 'Assignment', name: 'Material Selection Assignments', weight: 25, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Biomaterials'], tasks: ['Assignment 1: Biomaterial overview'] },
      { week: 2, topics: ['Metallic Biomaterials'], tasks: ['Assignment 2: Metal selection', 'Lab: Metal testing'] },
      { week: 3, topics: ['Ceramic Biomaterials'], tasks: ['Assignment 3: Ceramics', 'Lab: Ceramic properties'] },
      { week: 4, topics: ['Polymeric Biomaterials'], tasks: ['Assignment 4: Polymer selection'] },
      { week: 5, topics: ['Composite Biomaterials'], tasks: ['Assignment 5: Composites', 'Lab: Composite testing'] },
      { week: 6, topics: ['Biocompatibility'], tasks: ['Assignment 6: Biocompatibility assessment', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam'] },
      { week: 8, topics: ['Degradation and Corrosion'], tasks: ['Assignment 7: Degradation', 'Lab: Corrosion testing'] },
      { week: 9, topics: ['Tissue Engineering Scaffolds'], tasks: ['Assignment 8: Scaffold design'] },
      { week: 10, topics: ['Drug Delivery Systems'], tasks: ['Assignment 9: Drug delivery', 'Lab: Release testing'] },
      { week: 11, topics: ['Implant Design'], tasks: ['Assignment 10: Implant selection'] },
      { week: 12, topics: ['Regulatory Affairs', 'Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Biomaterial classes and biocompatibility' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive biomaterials' }
    ],
    textbooks: [
      { title: 'Biomaterials Science: An Introduction to Materials in Medicine', author: 'Ratner, B.D. et al.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Biomedical Engineering', 'Mechanical Engineering']
  },

  'ENGG*3210': {
    code: 'ENGG*3210',
    name: 'Communication Systems',
    credits: 0.5,
    semester: 'Winter',
    description: 'Principles of analog and digital communication systems including modulation, transmission, and noise.',
    prerequisites: ['ENGG*2450', 'MATH*2270'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Understand communication system principles',
      'Analyze modulation techniques',
      'Design communication links',
      'Understand noise and interference',
      'Apply signal processing to communications',
      'Use communication test equipment'
    ],
    assessments: [
      { type: 'Assignment', name: 'Communication Problems', weight: 25, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Communication System Overview'], tasks: ['Assignment 1: System analysis'] },
      { week: 2, topics: ['Amplitude Modulation'], tasks: ['Assignment 2: AM systems', 'Lab: AM modulation'] },
      { week: 3, topics: ['Frequency Modulation'], tasks: ['Assignment 3: FM systems', 'Lab: FM modulation'] },
      { week: 4, topics: ['Pulse Modulation'], tasks: ['Assignment 4: Pulse systems'] },
      { week: 5, topics: ['Digital Modulation'], tasks: ['Assignment 5: Digital comm', 'Lab: Digital modulation'] },
      { week: 6, topics: ['Noise in Communication Systems'], tasks: ['Assignment 6: Noise analysis', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam'] },
      { week: 8, topics: ['Channel Capacity'], tasks: ['Assignment 7: Channel capacity', 'Lab: Channel testing'] },
      { week: 9, topics: ['Error Detection and Correction'], tasks: ['Assignment 8: Error coding'] },
      { week: 10, topics: ['Spread Spectrum'], tasks: ['Assignment 9: Spread spectrum', 'Lab: Spread spectrum'] },
      { week: 11, topics: ['Wireless Communications'], tasks: ['Assignment 10: Wireless systems'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Analog and digital modulation' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive communications' }
    ],
    textbooks: [
      { title: 'Principles of Communication Systems', author: 'Taub, H. and Schilling, D.L.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Computer Engineering', 'Engineering Systems and Computing']
  },

  'ENGG*3220': {
    code: 'ENGG*3220',
    name: 'Water and Wastewater Treatment',
    credits: 0.5,
    semester: 'Winter',
    description: 'Design and operation of water and wastewater treatment systems including physical, chemical, and biological processes.',
    prerequisites: ['ENGG*2560'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Design water treatment systems',
      'Design wastewater treatment systems',
      'Understand treatment unit operations',
      'Apply biological treatment principles',
      'Perform treatment process calculations',
      'Test water quality parameters'
    ],
    assessments: [
      { type: 'Assignment', name: 'Design Assignments', weight: 30, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 20, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Project', name: 'Treatment Plant Design', weight: 30, dueWeek: 11 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Water Quality Standards'], tasks: ['Assignment 1: Water quality', 'Lab: Water testing'] },
      { week: 2, topics: ['Coagulation and Flocculation'], tasks: ['Assignment 2: Coag design', 'Lab: Jar test'] },
      { week: 3, topics: ['Sedimentation'], tasks: ['Assignment 3: Clarifier design', 'Lab: Settling test'] },
      { week: 4, topics: ['Filtration'], tasks: ['Assignment 4: Filter design', 'Lab: Filter performance'] },
      { week: 5, topics: ['Disinfection'], tasks: ['Assignment 5: Disinfection', 'Lab: Chlorination'] },
      { week: 6, topics: ['Wastewater Characteristics'], tasks: ['Assignment 6: WW analysis', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam', 'Lab: BOD test'] },
      { week: 8, topics: ['Primary Treatment'], tasks: ['Assignment 7: Primary treatment', 'Project work'] },
      { week: 9, topics: ['Activated Sludge Process'], tasks: ['Assignment 8: AS design', 'Lab: AS simulation'] },
      { week: 10, topics: ['Biological Nutrient Removal'], tasks: ['Assignment 9: BNR design', 'Project work'] },
      { week: 11, topics: ['Sludge Treatment'], tasks: ['Project submission'] },
      { week: 12, topics: ['Advanced Treatment', 'Review'], tasks: ['Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Water treatment processes' },
      { type: 'Project Due', name: 'Treatment Plant Design', typicalWeek: 11, description: 'Complete water or wastewater treatment plant design' }
    ],
    textbooks: [
      { title: 'Water and Wastewater Engineering', author: 'Davis, M.L.', required: true }
    ],
    requiredFor: ['Environmental Engineering', 'Water Resources Engineering'],
    electiveFor: ['Biological Engineering']
  },

  'ENGG*3240': {
    code: 'ENGG*3240',
    name: 'Engineering Economics',
    credits: 0.5,
    semester: 'Fall',
    description: 'Economic principles and methods for engineering decision-making including time value of money, project evaluation, and risk analysis.',
    prerequisites: [],
    lectureHours: 3,
    labHours: 0,
    weeklyHours: 3,
    learningObjectives: [
      'Apply time value of money concepts',
      'Evaluate engineering projects economically',
      'Perform depreciation calculations',
      'Analyze replacement decisions',
      'Assess project risk and uncertainty',
      'Make optimal economic decisions'
    ],
    assessments: [
      { type: 'Assignment', name: 'Problem Sets', weight: 35, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 30, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Engineering Economics Overview', 'Interest'], tasks: ['Assignment 1: Interest calculations'] },
      { week: 2, topics: ['Time Value of Money', 'Cash Flows'], tasks: ['Assignment 2: TVM problems'] },
      { week: 3, topics: ['Present Worth Analysis'], tasks: ['Assignment 3: PW methods'] },
      { week: 4, topics: ['Annual Worth Analysis'], tasks: ['Assignment 4: AW problems'] },
      { week: 5, topics: ['Rate of Return'], tasks: ['Assignment 5: ROR analysis'] },
      { week: 6, topics: ['Benefit-Cost Ratio'], tasks: ['Assignment 6: B/C analysis', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Depreciation'], tasks: ['Midterm exam'] },
      { week: 8, topics: ['Depreciation Methods'], tasks: ['Assignment 7: Depreciation'] },
      { week: 9, topics: ['Replacement Analysis'], tasks: ['Assignment 8: Replacement decisions'] },
      { week: 10, topics: ['Inflation'], tasks: ['Assignment 9: Inflation effects'] },
      { week: 11, topics: ['Risk and Uncertainty'], tasks: ['Assignment 10: Risk assessment'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'TVM through B/C analysis' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive engineering economics' }
    ],
    textbooks: [
      { title: 'Engineering Economy', author: 'Blank, L. and Tarquin, A.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Computer Engineering', 'Engineering Systems and Computing', 'Biological Engineering', 'Water Resources Engineering'],
    electiveFor: []
  },

  'ENGG*3250': {
    code: 'ENGG*3250',
    name: 'Energy Management and Utilization',
    credits: 0.5,
    semester: 'Fall',
    description: 'Energy management principles including energy auditing, efficiency measures, and conservation strategies.',
    prerequisites: ['ENGG*3260'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Conduct energy audits',
      'Analyze energy systems',
      'Design energy efficiency measures',
      'Calculate energy savings',
      'Understand energy policy',
      'Apply energy management principles'
    ],
    assessments: [
      { type: 'Assignment', name: 'Energy Analysis Assignments', weight: 30, isRecurring: true },
      { type: 'Project', name: 'Energy Audit Project', weight: 35, dueWeek: 11 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Energy Management Overview'], tasks: ['Assignment 1: Energy basics'] },
      { week: 2, topics: ['Energy Auditing Methodology'], tasks: ['Assignment 2: Audit planning'] },
      { week: 3, topics: ['Electrical Systems'], tasks: ['Assignment 3: Electrical efficiency'] },
      { week: 4, topics: ['Heating and Cooling Systems'], tasks: ['Assignment 4: HVAC analysis', 'Project site visit'] },
      { week: 5, topics: ['Lighting Systems'], tasks: ['Assignment 5: Lighting design', 'Project data collection'] },
      { week: 6, topics: ['Building Envelope'], tasks: ['Assignment 6: Insulation', 'Project analysis'] },
      { week: 7, topics: ['Motors and Drives'], tasks: ['Assignment 7: Motor efficiency', 'Project work'] },
      { week: 8, topics: ['Compressed Air Systems'], tasks: ['Assignment 8: Air systems', 'Project calculations'] },
      { week: 9, topics: ['Process Heat Recovery'], tasks: ['Assignment 9: Heat recovery', 'Project recommendations'] },
      { week: 10, topics: ['Renewable Energy Integration'], tasks: ['Assignment 10: Renewables', 'Project report'] },
      { week: 11, topics: ['Project Presentations'], tasks: ['Project submission', 'Presentation'] },
      { week: 12, topics: ['Energy Policy', 'Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'Energy Audit Project', typicalWeek: 11, description: 'Complete energy audit with recommendations' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Energy management concepts' }
    ],
    textbooks: [
      { title: 'Energy Management Handbook', author: 'Turner, W.C. and Doty, S.', required: true }
    ],
    requiredFor: [],
    electiveFor: ['Mechanical Engineering', 'Environmental Engineering']
  },

  'ENGG*3260': {
    code: 'ENGG*3260',
    name: 'Thermodynamics',
    credits: 0.5,
    semester: 'Fall',
    description: 'Fundamental principles of thermodynamics including energy, entropy, and thermodynamic cycles.',
    prerequisites: ['MATH*1210', 'PHYS*1130'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply first law of thermodynamics',
      'Apply second law of thermodynamics',
      'Analyze thermodynamic cycles',
      'Use thermodynamic properties',
      'Perform energy analysis',
      'Understand entropy generation'
    ],
    assessments: [
      { type: 'Assignment', name: 'Problem Sets', weight: 30, isRecurring: true },
      { type: 'Lab', name: 'Lab Reports', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Thermodynamics Basics', 'Properties'], tasks: ['Assignment 1: Properties', 'Lab: Temperature measurement'] },
      { week: 2, topics: ['Pure Substances'], tasks: ['Assignment 2: Phase change', 'Lab: Steam tables'] },
      { week: 3, topics: ['First Law - Closed Systems'], tasks: ['Assignment 3: Energy balance'] },
      { week: 4, topics: ['First Law - Control Volumes'], tasks: ['Assignment 4: CV analysis', 'Lab: Heat exchanger'] },
      { week: 5, topics: ['Second Law'], tasks: ['Assignment 5: Entropy'] },
      { week: 6, topics: ['Entropy'], tasks: ['Assignment 6: Entropy generation', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam'], tasks: ['Midterm exam', 'Lab: Refrigeration'] },
      { week: 8, topics: ['Power Cycles'], tasks: ['Assignment 7: Rankine cycle'] },
      { week: 9, topics: ['Gas Power Cycles'], tasks: ['Assignment 8: Brayton cycle', 'Lab: Engine testing'] },
      { week: 10, topics: ['Refrigeration Cycles'], tasks: ['Assignment 9: Refrigeration'] },
      { week: 11, topics: ['Gas Mixtures'], tasks: ['Assignment 10: Air conditioning', 'Lab: Psychrometrics'] },
      { week: 12, topics: ['Chemical Reactions', 'Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'First and second law fundamentals' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive thermodynamics' }
    ],
    textbooks: [
      { title: 'Thermodynamics: An Engineering Approach', author: 'Cengel, Y.A. and Boles, M.A.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Biological Engineering'],
    electiveFor: []
  },

  'ENGG*3280': {
    code: 'ENGG*3280',
    name: 'Machine Design',
    credits: 0.75,
    semester: 'Fall',
    description: 'Design of machine elements including shafts, bearings, gears, and fasteners with consideration for stress, strength, and failure.',
    prerequisites: ['ENGG*2160', 'ENGG*2120'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Design machine components',
      'Analyze stress and failure',
      'Select materials for machine elements',
      'Design shaft systems',
      'Select bearings and gears',
      'Apply design codes and standards'
    ],
    assessments: [
      { type: 'Assignment', name: 'Design Assignments', weight: 30, isRecurring: true },
      { type: 'Project', name: 'Machine Design Project', weight: 35, dueWeek: 11 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Design Process', 'Load Analysis'], tasks: ['Assignment 1: Load calculations'] },
      { week: 2, topics: ['Stress and Failure Theories'], tasks: ['Assignment 2: Failure analysis'] },
      { week: 3, topics: ['Fatigue Design'], tasks: ['Assignment 3: Fatigue problems', 'Project selection'] },
      { week: 4, topics: ['Shaft Design'], tasks: ['Assignment 4: Shaft sizing', 'Project preliminary design'] },
      { week: 5, topics: ['Keys and Couplings'], tasks: ['Assignment 5: Power transmission'] },
      { week: 6, topics: ['Bearing Selection'], tasks: ['Assignment 6: Bearing life', 'Project design'] },
      { week: 7, topics: ['Rolling Contact Bearings'], tasks: ['Assignment 7: Bearing design'] },
      { week: 8, topics: ['Gear Design'], tasks: ['Assignment 8: Spur gears', 'Project CAD'] },
      { week: 9, topics: ['Helical and Bevel Gears'], tasks: ['Assignment 9: Gear systems'] },
      { week: 10, topics: ['Bolted and Welded Joints'], tasks: ['Assignment 10: Fasteners', 'Project completion'] },
      { week: 11, topics: ['Project Presentations'], tasks: ['Project submission', 'Presentation'] },
      { week: 12, topics: ['Review'], tasks: ['Final exam review'] }
    ],
    milestones: [
      { type: 'Project Due', name: 'Machine Design Project', typicalWeek: 11, description: 'Complete machine design with calculations and CAD' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Machine design concepts' }
    ],
    textbooks: [
      { title: 'Shigley\'s Mechanical Engineering Design', author: 'Budynas, R.G. and Nisbett, J.K.', required: true }
    ],
    requiredFor: ['Mechanical Engineering'],
    electiveFor: ['Mechatronics']
  }
};

// ============================================
// MATHEMATICS COURSES
// ============================================

export const MATH_COURSES: { [key: string]: CourseOutline } = {
  'MATH*1200': {
    code: 'MATH*1200',
    name: 'Calculus I',
    credits: 0.5,
    semester: 'Fall/Winter',
    description: 'Introduction to differential calculus with applications. Topics include limits, derivatives, optimization, curve sketching, and integration.',
    prerequisites: ['Grade 12 Advanced Functions', 'Grade 12 Calculus and Vectors'],
    lectureHours: 3,
    labHours: 1,
    weeklyHours: 4,
    learningObjectives: [
      'Calculate limits of functions',
      'Apply derivative rules to differentiate functions',
      'Use derivatives to solve optimization problems',
      'Sketch curves using calculus techniques',
      'Evaluate basic integrals',
      'Apply calculus to real-world problems'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm 1', weight: 20, dueWeek: 5 },
      { type: 'Midterm', name: 'Midterm 2', weight: 20, dueWeek: 9 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Review of Functions', 'Limits'], tasks: ['Assignment 1: Limits', 'Review precalculus'] },
      { week: 2, topics: ['Continuity', 'Derivatives'], tasks: ['Assignment 2: Derivative definition', 'Practice limit problems'] },
      { week: 3, topics: ['Derivative Rules', 'Product and Quotient Rules'], tasks: ['Assignment 3: Differentiation', 'Memorize derivative rules'] },
      { week: 4, topics: ['Chain Rule', 'Implicit Differentiation'], tasks: ['Assignment 4: Chain rule problems', 'Practice implicit differentiation'] },
      { week: 5, topics: ['Review and Midterm 1'], tasks: ['Midterm 1', 'Review sessions'] },
      { week: 6, topics: ['Applications of Derivatives', 'Related Rates'], tasks: ['Assignment 5: Related rates', 'Word problems practice'] },
      { week: 7, topics: ['Optimization', 'Curve Sketching'], tasks: ['Assignment 6: Optimization', 'Curve sketching practice'] },
      { week: 8, topics: ['Antiderivatives', 'Integration'], tasks: ['Assignment 7: Integration basics', 'Integration rules'] },
      { week: 9, topics: ['Definite Integrals', 'Midterm 2'], tasks: ['Midterm 2', 'Integration practice'] },
      { week: 10, topics: ['Fundamental Theorem of Calculus'], tasks: ['Assignment 8: FTC applications', 'Area calculations'] },
      { week: 11, topics: ['Substitution Method', 'Applications of Integration'], tasks: ['Assignment 9: Substitution', 'Volume calculations'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Complete practice final', 'Review all topics'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm 1', typicalWeek: 5, description: 'Covers limits through chain rule' },
      { type: 'Midterm', name: 'Midterm 2', typicalWeek: 9, description: 'Covers derivatives applications through integration' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive exam all material' }
    ],
    textbooks: [
      { title: 'Calculus: Early Transcendentals', author: 'Stewart, J.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'MATH*1160': {
    code: 'MATH*1160',
    name: 'Linear Algebra I',
    credits: 0.5,
    semester: 'Fall/Winter',
    description: 'Introduction to linear algebra including systems of linear equations, matrices, determinants, vector spaces, and eigenvalues.',
    prerequisites: ['Grade 12 Advanced Functions'],
    lectureHours: 3,
    labHours: 1,
    weeklyHours: 4,
    learningObjectives: [
      'Solve systems of linear equations',
      'Perform matrix operations',
      'Calculate determinants',
      'Understand vector spaces',
      'Find eigenvalues and eigenvectors',
      'Apply linear algebra to applications'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm 1', weight: 20, dueWeek: 5 },
      { type: 'Midterm', name: 'Midterm 2', weight: 20, dueWeek: 9 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Systems of Linear Equations', 'Gaussian Elimination'], tasks: ['Assignment 1: Linear systems', 'Row operations practice'] },
      { week: 2, topics: ['Matrix Operations', 'Matrix Algebra'], tasks: ['Assignment 2: Matrices', 'Matrix multiplication'] },
      { week: 3, topics: ['Inverses', 'Matrix Inverse'], tasks: ['Assignment 3: Inverses', 'Inverse calculations'] },
      { week: 4, topics: ['Determinants', 'Properties'], tasks: ['Assignment 4: Determinants', 'Determinant methods'] },
      { week: 5, topics: ['Review and Midterm 1'], tasks: ['Midterm 1', 'Review session'] },
      { week: 6, topics: ['Vector Spaces', 'Subspaces'], tasks: ['Assignment 5: Vector spaces', 'Subspace problems'] },
      { week: 7, topics: ['Linear Independence', 'Basis'], tasks: ['Assignment 6: Independence', 'Basis finding'] },
      { week: 8, topics: ['Linear Transformations'], tasks: ['Assignment 7: Transformations', 'Transformation matrices'] },
      { week: 9, topics: ['Eigenvalues and Eigenvectors', 'Midterm 2'], tasks: ['Midterm 2', 'Eigenvalue calculations'] },
      { week: 10, topics: ['Diagonalization'], tasks: ['Assignment 8: Diagonalization', 'Matrix powers'] },
      { week: 11, topics: ['Inner Products', 'Orthogonality'], tasks: ['Assignment 9: Inner products', 'Gram-Schmidt'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm 1', typicalWeek: 5, description: 'Systems through determinants' },
      { type: 'Midterm', name: 'Midterm 2', typicalWeek: 9, description: 'Vector spaces through eigenvalues' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive linear algebra' }
    ],
    textbooks: [
      { title: 'Elementary Linear Algebra', author: 'Anton, H. and Rorres, C.', required: true }
    ],
    requiredFor: ['Computer Science'],
    electiveFor: ['All Engineering Programs']
  },

  'MATH*1210': {
    code: 'MATH*1210',
    name: 'Calculus II',
    credits: 0.5,
    semester: 'Winter',
    description: 'Continuation of Calculus I. Topics include integration techniques, applications of integration, sequences and series, and parametric equations.',
    prerequisites: ['MATH*1200'],
    lectureHours: 3,
    labHours: 1,
    weeklyHours: 4,
    learningObjectives: [
      'Apply advanced integration techniques',
      'Calculate areas and volumes using integration',
      'Analyze sequences and series convergence',
      'Work with parametric and polar equations',
      'Solve differential equations',
      'Apply calculus to engineering problems'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm 1', weight: 20, dueWeek: 5 },
      { type: 'Midterm', name: 'Midterm 2', weight: 20, dueWeek: 9 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Integration Review', 'Integration by Parts'], tasks: ['Assignment 1: Integration techniques', 'Review Calc I'] },
      { week: 2, topics: ['Trigonometric Integrals', 'Trigonometric Substitution'], tasks: ['Assignment 2: Trig integrals', 'Memorize trig identities'] },
      { week: 3, topics: ['Partial Fractions', 'Improper Integrals'], tasks: ['Assignment 3: Partial fractions', 'Practice decomposition'] },
      { week: 4, topics: ['Applications: Area and Volume'], tasks: ['Assignment 4: Volume problems', 'Visualization practice'] },
      { week: 5, topics: ['Review and Midterm 1'], tasks: ['Midterm 1', 'Integration review'] },
      { week: 6, topics: ['Sequences', 'Series'], tasks: ['Assignment 5: Sequences', 'Convergence tests'] },
      { week: 7, topics: ['Tests for Convergence', 'Power Series'], tasks: ['Assignment 6: Series convergence', 'Practice tests'] },
      { week: 8, topics: ['Taylor and Maclaurin Series'], tasks: ['Assignment 7: Taylor series', 'Series representations'] },
      { week: 9, topics: ['Parametric Equations', 'Midterm 2'], tasks: ['Midterm 2', 'Parametric curves'] },
      { week: 10, topics: ['Polar Coordinates', 'Polar Equations'], tasks: ['Assignment 8: Polar coordinates', 'Graphing polar curves'] },
      { week: 11, topics: ['Differential Equations', 'Separable Equations'], tasks: ['Assignment 9: Diff equations', 'Solution methods'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Complete practice final', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm 1', typicalWeek: 5, description: 'Integration techniques and applications' },
      { type: 'Midterm', name: 'Midterm 2', typicalWeek: 9, description: 'Sequences, series, and parametric equations' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive final exam' }
    ],
    textbooks: [
      { title: 'Calculus: Early Transcendentals', author: 'Stewart, J.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'MATH*2270': {
    code: 'MATH*2270',
    name: 'Applied Differential Equations',
    credits: 0.5,
    semester: 'Fall',
    description: 'First and second-order ordinary differential equations with applications to engineering problems. Topics include Laplace transforms and systems of differential equations.',
    prerequisites: ['MATH*1210'],
    lectureHours: 3,
    labHours: 1,
    weeklyHours: 4,
    learningObjectives: [
      'Solve first-order differential equations',
      'Solve second-order linear differential equations',
      'Apply Laplace transforms to solve ODEs',
      'Model engineering systems with differential equations',
      'Solve systems of differential equations',
      'Analyze solutions for physical meaning'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 30, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 45, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to ODEs', 'First-Order Linear Equations'], tasks: ['Assignment 1: Linear ODEs', 'Review integration'] },
      { week: 2, topics: ['Separable Equations', 'Exact Equations'], tasks: ['Assignment 2: Separable equations', 'Practice techniques'] },
      { week: 3, topics: ['Applications: Growth and Decay', 'Mixing Problems'], tasks: ['Assignment 3: Applications', 'Model real systems'] },
      { week: 4, topics: ['Second-Order Linear ODEs', 'Homogeneous Equations'], tasks: ['Assignment 4: Second-order', 'Characteristic equations'] },
      { week: 5, topics: ['Non-Homogeneous Equations', 'Method of Undetermined Coefficients'], tasks: ['Assignment 5: Non-homogeneous', 'Practice methods'] },
      { week: 6, topics: ['Variation of Parameters', 'Applications'], tasks: ['Assignment 6: Advanced methods', 'Engineering applications'] },
      { week: 7, topics: ['Midterm Exam', 'Laplace Transform Introduction'], tasks: ['Midterm exam', 'Laplace table review'] },
      { week: 8, topics: ['Laplace Transform Properties', 'Inverse Laplace'], tasks: ['Assignment 7: Laplace transforms', 'Transform pairs'] },
      { week: 9, topics: ['Solving ODEs with Laplace Transforms'], tasks: ['Assignment 8: Laplace ODE solutions', 'Practice problems'] },
      { week: 10, topics: ['Systems of ODEs', 'Matrix Methods'], tasks: ['Assignment 9: Systems', 'Eigenvalue review'] },
      { week: 11, topics: ['Phase Plane Analysis', 'Stability'], tasks: ['Assignment 10: Phase portraits', 'Stability analysis'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice final', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'First and second-order ODEs' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including Laplace transforms' }
    ],
    textbooks: [
      { title: 'Elementary Differential Equations', author: 'Boyce, W.E. and DiPrima, R.C.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'MATH*2130': {
    code: 'MATH*2130',
    name: 'Numerical Methods',
    credits: 0.5,
    semester: 'Winter',
    description: 'Numerical techniques for solving engineering problems. Topics include root finding, interpolation, numerical integration, and numerical solutions of differential equations.',
    prerequisites: ['MATH*1210', 'Programming experience'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Implement numerical root-finding algorithms',
      'Perform numerical interpolation and approximation',
      'Use numerical integration techniques',
      'Solve ODEs numerically',
      'Analyze numerical errors and convergence',
      'Program numerical methods in MATLAB/Python'
    ],
    assessments: [
      { type: 'Assignment', name: 'Programming Assignments', weight: 30, isRecurring: true, frequency: 'Bi-weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 30, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 40, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Numerical Methods', 'Error Analysis'], tasks: ['Assignment 1: Error calculations', 'MATLAB setup'] },
      { week: 2, topics: ['Root Finding: Bisection Method'], tasks: ['Code bisection algorithm', 'Convergence analysis'] },
      { week: 3, topics: ['Newton-Raphson Method', 'Secant Method'], tasks: ['Assignment 2: Root finding', 'Compare methods'] },
      { week: 4, topics: ['Interpolation', 'Lagrange Polynomials'], tasks: ['Implement interpolation', 'Error analysis'] },
      { week: 5, topics: ['Spline Interpolation', 'Least Squares'], tasks: ['Assignment 3: Curve fitting', 'Regression analysis'] },
      { week: 6, topics: ['Numerical Differentiation', 'Numerical Integration'], tasks: ['Code integration methods', 'Accuracy comparison'] },
      { week: 7, topics: ['Midterm Exam', 'Gaussian Quadrature'], tasks: ['Midterm exam', 'Review integration'] },
      { week: 8, topics: ['ODEs: Euler Method', 'Runge-Kutta Methods'], tasks: ['Assignment 4: ODE solvers', 'Implement RK4'] },
      { week: 9, topics: ['Systems of ODEs', 'Boundary Value Problems'], tasks: ['Solve ODE systems', 'BVP shooting method'] },
      { week: 10, topics: ['Linear Systems', 'Gaussian Elimination'], tasks: ['Assignment 5: Linear solvers', 'LU decomposition'] },
      { week: 11, topics: ['Iterative Methods', 'Jacobi and Gauss-Seidel'], tasks: ['Implement iterative methods', 'Convergence testing'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Complete practice problems', 'Code review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Root finding through integration' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including ODEs' }
    ],
    textbooks: [
      { title: 'Numerical Methods for Engineers', author: 'Chapra, S.C. and Canale, R.P.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  }
};

// ============================================
// PHYSICS COURSES
// ============================================

export const PHYS_COURSES: { [key: string]: CourseOutline } = {
  'PHYS*1130': {
    code: 'PHYS*1130',
    name: 'Physics with Applications',
    credits: 0.5,
    semester: 'Fall',
    description: 'Introductory physics for engineering students covering mechanics, waves, and thermodynamics with engineering applications.',
    prerequisites: ['Grade 12 Physics', 'MATH*1200 (corequisite)'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Apply Newton\'s laws to analyze motion',
      'Understand conservation of energy and momentum',
      'Analyze rotational motion and equilibrium',
      'Understand wave phenomena',
      'Apply thermodynamic principles',
      'Perform experimental measurements and analysis'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Problem Sets', weight: 15, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Kinematics', 'Vectors'], tasks: ['Assignment 1: Kinematics', 'Lab: Measurements'] },
      { week: 2, topics: ['Newton\'s Laws', 'Forces'], tasks: ['Assignment 2: Forces', 'Lab: Newton\'s laws'] },
      { week: 3, topics: ['Work and Energy', 'Conservation of Energy'], tasks: ['Assignment 3: Energy', 'Lab: Energy conservation'] },
      { week: 4, topics: ['Momentum', 'Collisions'], tasks: ['Assignment 4: Momentum', 'Lab: Collisions'] },
      { week: 5, topics: ['Rotational Motion', 'Torque'], tasks: ['Assignment 5: Rotation', 'Lab: Rotational dynamics'] },
      { week: 6, topics: ['Angular Momentum', 'Equilibrium'], tasks: ['Assignment 6: Angular momentum', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Oscillations'], tasks: ['Midterm exam', 'Lab: Simple harmonic motion'] },
      { week: 8, topics: ['Waves', 'Sound'], tasks: ['Assignment 7: Waves', 'Lab: Wave properties'] },
      { week: 9, topics: ['Thermodynamics: Temperature and Heat'], tasks: ['Assignment 8: Heat transfer', 'Lab: Calorimetry'] },
      { week: 10, topics: ['First Law of Thermodynamics'], tasks: ['Assignment 9: First law', 'Lab: Heat engines'] },
      { week: 11, topics: ['Second Law of Thermodynamics', 'Entropy'], tasks: ['Assignment 10: Entropy', 'Lab: Efficiency'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Mechanics through rotational motion' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including thermodynamics' }
    ],
    textbooks: [
      { title: 'University Physics', author: 'Young, H.D. and Freedman, R.A.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'PHYS*1010': {
    code: 'PHYS*1010',
    name: 'Introductory Electricity and Magnetism',
    credits: 0.5,
    semester: 'Winter',
    description: 'Introduction to electricity, magnetism, and electromagnetic waves for engineering students.',
    prerequisites: ['PHYS*1130', 'MATH*1200'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Apply Coulomb\'s law and electric field concepts',
      'Analyze electric circuits',
      'Understand magnetic fields and forces',
      'Apply Faraday\'s law and electromagnetic induction',
      'Understand AC circuits',
      'Perform electrical measurements'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Assignment', name: 'Problem Sets', weight: 15, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Electric Charge', 'Coulomb\'s Law'], tasks: ['Assignment 1: Electric forces', 'Lab: Electrostatics'] },
      { week: 2, topics: ['Electric Fields', 'Gauss\'s Law'], tasks: ['Assignment 2: Electric fields', 'Lab: Field mapping'] },
      { week: 3, topics: ['Electric Potential', 'Capacitance'], tasks: ['Assignment 3: Potential', 'Lab: Capacitors'] },
      { week: 4, topics: ['Current and Resistance', 'Ohm\'s Law'], tasks: ['Assignment 4: Circuits', 'Lab: Resistor networks'] },
      { week: 5, topics: ['DC Circuits', 'Kirchhoff\'s Laws'], tasks: ['Assignment 5: Circuit analysis', 'Lab: DC circuits'] },
      { week: 6, topics: ['RC Circuits', 'Magnetic Fields'], tasks: ['Assignment 6: RC circuits', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Magnetic Forces'], tasks: ['Midterm exam', 'Lab: Magnetism'] },
      { week: 8, topics: ['Ampere\'s Law', 'Magnetic Materials'], tasks: ['Assignment 7: Magnetic fields', 'Lab: Electromagnets'] },
      { week: 9, topics: ['Faraday\'s Law', 'Electromagnetic Induction'], tasks: ['Assignment 8: Induction', 'Lab: Induced EMF'] },
      { week: 10, topics: ['Inductance', 'RL Circuits'], tasks: ['Assignment 9: Inductors', 'Lab: RL circuits'] },
      { week: 11, topics: ['AC Circuits', 'Electromagnetic Waves'], tasks: ['Assignment 10: AC analysis', 'Lab: AC circuits'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Electric fields through DC circuits' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including magnetism and AC' }
    ],
    textbooks: [
      { title: 'University Physics', author: 'Young, H.D. and Freedman, R.A.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  }
};

// ============================================
// CHEMISTRY COURSES
// ============================================

export const CHEM_COURSES: { [key: string]: CourseOutline } = {
  'CHEM*1040': {
    code: 'CHEM*1040',
    name: 'General Chemistry I',
    credits: 0.5,
    semester: 'Fall',
    description: 'Introduction to chemistry including atomic structure, bonding, stoichiometry, states of matter, and chemical reactions.',
    prerequisites: ['Grade 12 Chemistry'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Understand atomic structure and periodic trends',
      'Apply stoichiometric principles',
      'Describe chemical bonding theories',
      'Analyze states of matter',
      'Balance chemical equations',
      'Perform laboratory techniques safely'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Quiz', name: 'Weekly Quizzes', weight: 15, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Matter and Measurement', 'Dimensional Analysis'], tasks: ['Quiz 1', 'Lab: Safety and measurements'] },
      { week: 2, topics: ['Atoms, Molecules, and Ions'], tasks: ['Quiz 2', 'Lab: Chemical formulas'] },
      { week: 3, topics: ['Stoichiometry', 'Chemical Equations'], tasks: ['Quiz 3', 'Lab: Stoichiometry'] },
      { week: 4, topics: ['Reactions in Aqueous Solutions'], tasks: ['Quiz 4', 'Lab: Precipitation reactions'] },
      { week: 5, topics: ['Thermochemistry', 'Enthalpy'], tasks: ['Quiz 5', 'Lab: Calorimetry'] },
      { week: 6, topics: ['Electronic Structure of Atoms'], tasks: ['Quiz 6', 'Lab: Flame tests'] },
      { week: 7, topics: ['Midterm Exam', 'Periodic Properties'], tasks: ['Midterm exam', 'Review periodic table'] },
      { week: 8, topics: ['Chemical Bonding', 'Lewis Structures'], tasks: ['Quiz 7', 'Lab: Molecular models'] },
      { week: 9, topics: ['Molecular Geometry', 'VSEPR Theory'], tasks: ['Quiz 8', 'Lab: 3D structures'] },
      { week: 10, topics: ['Gases', 'Gas Laws'], tasks: ['Quiz 9', 'Lab: Gas experiments'] },
      { week: 11, topics: ['Liquids and Solids', 'Phase Changes'], tasks: ['Quiz 10', 'Lab: Phase diagrams'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice exam', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Stoichiometry through electronic structure' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive all topics' }
    ],
    textbooks: [
      { title: 'Chemistry: The Central Science', author: 'Brown, LeMay, Bursten', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  },

  'CHEM*1050': {
    code: 'CHEM*1050',
    name: 'General Chemistry II',
    credits: 0.5,
    semester: 'Winter',
    description: 'Continuation of General Chemistry I covering solutions, kinetics, equilibrium, acids and bases, and electrochemistry.',
    prerequisites: ['CHEM*1040'],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Analyze solution properties and colligative properties',
      'Apply chemical kinetics principles',
      'Calculate equilibrium constants',
      'Understand acid-base chemistry',
      'Apply redox and electrochemistry principles',
      'Perform quantitative chemical analysis'
    ],
    assessments: [
      { type: 'Lab', name: 'Lab Reports', weight: 25, isRecurring: true, frequency: 'Weekly' },
      { type: 'Quiz', name: 'Weekly Quizzes', weight: 15, isRecurring: true, frequency: 'Weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Solutions', 'Concentration Units'], tasks: ['Quiz 1', 'Lab: Solution preparation'] },
      { week: 2, topics: ['Colligative Properties'], tasks: ['Quiz 2', 'Lab: Freezing point depression'] },
      { week: 3, topics: ['Chemical Kinetics', 'Reaction Rates'], tasks: ['Quiz 3', 'Lab: Kinetics experiment'] },
      { week: 4, topics: ['Reaction Mechanisms', 'Catalysis'], tasks: ['Quiz 4', 'Lab: Catalysts'] },
      { week: 5, topics: ['Chemical Equilibrium'], tasks: ['Quiz 5', 'Lab: Le Chatelier\'s principle'] },
      { week: 6, topics: ['Equilibrium Calculations'], tasks: ['Quiz 6', 'Lab: Equilibrium constants'] },
      { week: 7, topics: ['Midterm Exam', 'Acids and Bases'], tasks: ['Midterm exam', 'Lab: pH measurements'] },
      { week: 8, topics: ['Acid-Base Equilibria', 'Buffers'], tasks: ['Quiz 7', 'Lab: Buffer solutions'] },
      { week: 9, topics: ['Titrations', 'Solubility Equilibria'], tasks: ['Quiz 8', 'Lab: Acid-base titration'] },
      { week: 10, topics: ['Thermodynamics', 'Entropy and Free Energy'], tasks: ['Quiz 9', 'Lab: Thermodynamics'] },
      { week: 11, topics: ['Electrochemistry', 'Redox Reactions'], tasks: ['Quiz 10', 'Lab: Electrochemical cells'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice exam', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Solutions through equilibrium' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive all material' }
    ],
    textbooks: [
      { title: 'Chemistry: The Central Science', author: 'Brown, LeMay, Bursten', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  }
};

// ============================================
// STATISTICS COURSES
// ============================================

export const STAT_COURSES: { [key: string]: CourseOutline } = {
  'STAT*2120': {
    code: 'STAT*2120',
    name: 'Probability and Statistics for Engineers',
    credits: 0.5,
    semester: 'Winter',
    description: 'Introduction to probability and statistics with engineering applications. Topics include probability distributions, hypothesis testing, and regression analysis.',
    prerequisites: ['MATH*1210'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply probability concepts to engineering problems',
      'Analyze data using statistical methods',
      'Perform hypothesis testing',
      'Use regression analysis',
      'Apply quality control techniques',
      'Use statistical software'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Assignments', weight: 20, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Computer Labs', weight: 15, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 30, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 35, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Probability Basics', 'Sample Spaces'], tasks: ['Assignment 1: Probability', 'Lab: Data exploration'] },
      { week: 2, topics: ['Conditional Probability', 'Independence'], tasks: ['Assignment 2: Conditional probability', 'Bayes theorem'] },
      { week: 3, topics: ['Random Variables', 'Distributions'], tasks: ['Assignment 3: Distributions', 'Lab: Simulations'] },
      { week: 4, topics: ['Binomial and Poisson Distributions'], tasks: ['Assignment 4: Discrete distributions', 'Applications'] },
      { week: 5, topics: ['Normal Distribution', 'Central Limit Theorem'], tasks: ['Assignment 5: Normal distribution', 'Lab: CLT demonstration'] },
      { week: 6, topics: ['Sampling Distributions', 'Confidence Intervals'], tasks: ['Assignment 6: Confidence intervals', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Hypothesis Testing'], tasks: ['Midterm exam', 'Lab: Hypothesis tests'] },
      { week: 8, topics: ['t-Tests', 'Chi-Square Tests'], tasks: ['Assignment 7: Hypothesis testing', 'Statistical tests'] },
      { week: 9, topics: ['ANOVA', 'Comparing Multiple Groups'], tasks: ['Assignment 8: ANOVA', 'Lab: ANOVA analysis'] },
      { week: 10, topics: ['Simple Linear Regression'], tasks: ['Assignment 9: Regression', 'Lab: Regression models'] },
      { week: 11, topics: ['Multiple Regression', 'Model Selection'], tasks: ['Assignment 10: Multiple regression', 'Model fitting'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Probability through sampling distributions' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive including regression' }
    ],
    textbooks: [
      { title: 'Probability and Statistics for Engineering and the Sciences', author: 'Devore, J.L.', required: true }
    ],
    requiredFor: ['All Engineering Programs'],
    electiveFor: []
  }
};

// ============================================
// COMPUTER SCIENCE COURSES
// ============================================

export const CIS_COURSES: { [key: string]: CourseOutline } = {
  'CIS*1300': {
    code: 'CIS*1300',
    name: 'Programming',
    credits: 0.5,
    semester: 'Fall',
    description: 'Introduction to computer programming for students planning further CIS courses. Topics include problem solving, algorithms, and C programming.',
    prerequisites: [],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Design and implement algorithms',
      'Write programs in C language',
      'Use pointers and dynamic memory',
      'Implement data structures',
      'Debug and test programs',
      'Apply software development practices'
    ],
    assessments: [
      { type: 'Assignment', name: 'Programming Assignments', weight: 45, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Exercises', weight: 10, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 25, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['C Programming Basics', 'Variables and Types'], tasks: ['Assignment 1: Basic programs', 'Lab: Setup environment'] },
      { week: 2, topics: ['Control Structures', 'Loops'], tasks: ['Assignment 2: Loops', 'Lab: Iteration'] },
      { week: 3, topics: ['Functions', 'Scope'], tasks: ['Assignment 3: Functions', 'Lab: Modular programming'] },
      { week: 4, topics: ['Arrays', 'Array Processing'], tasks: ['Assignment 4: Arrays', 'Lab: Array algorithms'] },
      { week: 5, topics: ['Strings', 'String Manipulation'], tasks: ['Assignment 5: String processing', 'Lab: Text processing'] },
      { week: 6, topics: ['Pointers', 'Pointer Arithmetic'], tasks: ['Assignment 6: Pointers', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Dynamic Memory'], tasks: ['Midterm exam', 'Lab: malloc/free'] },
      { week: 8, topics: ['Structures', 'User-Defined Types'], tasks: ['Assignment 7: Structures', 'Lab: Complex data'] },
      { week: 9, topics: ['File I/O', 'File Processing'], tasks: ['Assignment 8: File handling', 'Lab: Data files'] },
      { week: 10, topics: ['Recursion', 'Recursive Algorithms'], tasks: ['Assignment 9: Recursion', 'Lab: Recursive problems'] },
      { week: 11, topics: ['Linked Lists', 'Dynamic Data Structures'], tasks: ['Assignment 10: Linked lists', 'Lab: List operations'] },
      { week: 12, topics: ['Review and Final Project'], tasks: ['Complete final project', 'Code review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'C basics through pointers' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive programming exam' }
    ],
    textbooks: [
      { title: 'C Programming: A Modern Approach', author: 'King, K.N.', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: []
  },

  'CIS*1500': {
    code: 'CIS*1500',
    name: 'Introduction to Programming',
    credits: 0.5,
    semester: 'Fall/Winter',
    description: 'Introduction to computer programming using a high-level language. Topics include variables, control structures, functions, and basic data structures.',
    prerequisites: [],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Write programs using variables and data types',
      'Use control structures (loops, conditionals)',
      'Create and use functions',
      'Work with arrays and strings',
      'Understand basic algorithms',
      'Debug and test programs'
    ],
    assessments: [
      { type: 'Assignment', name: 'Programming Assignments', weight: 40, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Exercises', weight: 10, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Programming', 'Variables and Data Types'], tasks: ['Assignment 1: Hello World', 'Lab: Setup environment'] },
      { week: 2, topics: ['Input/Output', 'Basic Operators'], tasks: ['Assignment 2: I/O program', 'Lab: Calculator'] },
      { week: 3, topics: ['Conditional Statements', 'if-else'], tasks: ['Assignment 3: Decision making', 'Lab: Conditionals'] },
      { week: 4, topics: ['Loops', 'while and for'], tasks: ['Assignment 4: Loops', 'Lab: Iteration problems'] },
      { week: 5, topics: ['Functions', 'Parameters'], tasks: ['Assignment 5: Functions', 'Lab: Modular code'] },
      { week: 6, topics: ['Arrays', 'Array Operations'], tasks: ['Assignment 6: Arrays', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Strings'], tasks: ['Midterm exam', 'Lab: String manipulation'] },
      { week: 8, topics: ['File I/O', 'Reading and Writing Files'], tasks: ['Assignment 7: File processing', 'Lab: File operations'] },
      { week: 9, topics: ['Searching Algorithms'], tasks: ['Assignment 8: Search', 'Lab: Linear and binary search'] },
      { week: 10, topics: ['Sorting Algorithms'], tasks: ['Assignment 9: Sorting', 'Lab: Sort implementations'] },
      { week: 11, topics: ['Structures/Records', 'Complex Data'], tasks: ['Assignment 10: Structures', 'Lab: Data organization'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice coding problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Basics through functions and arrays' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive programming exam' }
    ],
    textbooks: [
      { title: 'C Programming: A Modern Approach', author: 'King, K.N.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Biological Engineering', 'Civil Engineering', 'Water Resources Engineering', 'Environmental Engineering'],
    electiveFor: []
  },

  'CIS*1910': {
    code: 'CIS*1910',
    name: 'Discrete Structures in Computing I',
    credits: 0.5,
    semester: 'Fall',
    description: 'Mathematical foundations for computer science including logic, sets, functions, relations, counting, and graph theory.',
    prerequisites: [],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply propositional and predicate logic',
      'Use set theory and functions',
      'Analyze relations and equivalence classes',
      'Apply counting principles and combinatorics',
      'Understand graph theory fundamentals',
      'Apply proof techniques'
    ],
    assessments: [
      { type: 'Assignment', name: 'Weekly Problem Sets', weight: 30, isRecurring: true, frequency: 'Weekly' },
      { type: 'Quiz', name: 'Weekly Quizzes', weight: 15, isRecurring: true, frequency: 'Bi-weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 25, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Logic', 'Propositional Logic'], tasks: ['Assignment 1: Truth tables', 'Logic practice'] },
      { week: 2, topics: ['Predicate Logic', 'Quantifiers'], tasks: ['Assignment 2: Predicates', 'Quiz 1'] },
      { week: 3, topics: ['Proof Techniques', 'Direct Proof'], tasks: ['Assignment 3: Proofs', 'Proof practice'] },
      { week: 4, topics: ['Mathematical Induction'], tasks: ['Assignment 4: Induction', 'Quiz 2'] },
      { week: 5, topics: ['Sets', 'Set Operations'], tasks: ['Assignment 5: Sets', 'Set algebra'] },
      { week: 6, topics: ['Functions', 'Relations'], tasks: ['Assignment 6: Functions', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Equivalence Relations'], tasks: ['Midterm exam', 'Relations practice'] },
      { week: 8, topics: ['Counting Principles', 'Permutations'], tasks: ['Assignment 7: Counting', 'Quiz 3'] },
      { week: 9, topics: ['Combinations', 'Binomial Theorem'], tasks: ['Assignment 8: Combinations', 'Combinatorics'] },
      { week: 10, topics: ['Graph Theory', 'Graph Terminology'], tasks: ['Assignment 9: Graphs', 'Quiz 4'] },
      { week: 11, topics: ['Trees', 'Graph Algorithms'], tasks: ['Assignment 10: Trees', 'Graph traversal'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Comprehensive review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Logic through relations' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive all topics' }
    ],
    textbooks: [
      { title: 'Discrete Mathematics and Its Applications', author: 'Rosen, K.H.', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: []
  },

  'CIS*2500': {
    code: 'CIS*2500',
    name: 'Intermediate Programming',
    credits: 0.5,
    semester: 'Fall',
    description: 'Intermediate programming concepts including advanced data structures, object-oriented programming, and software design principles.',
    prerequisites: ['CIS*1300'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply object-oriented programming principles',
      'Implement advanced data structures',
      'Use version control systems',
      'Apply software design patterns',
      'Write maintainable code',
      'Perform unit testing'
    ],
    assessments: [
      { type: 'Assignment', name: 'Programming Assignments', weight: 50, isRecurring: true, frequency: 'Bi-weekly' },
      { type: 'Project', name: 'Software Project', weight: 20, dueWeek: 11 },
      { type: 'Midterm', name: 'Midterm Exam', weight: 15, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 15, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['OOP Introduction', 'Classes and Objects'], tasks: ['Assignment 1: OOP basics', 'Review C programming'] },
      { week: 2, topics: ['Encapsulation', 'Constructors and Destructors'], tasks: ['Assignment 2: Class design', 'OOP practice'] },
      { week: 3, topics: ['Inheritance', 'Polymorphism'], tasks: ['Assignment 3: Inheritance', 'Practice problems'] },
      { week: 4, topics: ['Abstract Classes', 'Interfaces'], tasks: ['Assignment 4: Abstraction', 'Design patterns'] },
      { week: 5, topics: ['Linked Lists', 'Implementation'], tasks: ['Assignment 5: Linked lists', 'List operations'] },
      { week: 6, topics: ['Stacks and Queues'], tasks: ['Assignment 6: Stacks/Queues', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Trees'], tasks: ['Midterm exam', 'Tree concepts'] },
      { week: 8, topics: ['Binary Search Trees', 'Tree Traversal'], tasks: ['Assignment 7: BST implementation', 'Traversal practice'] },
      { week: 9, topics: ['Hash Tables', 'Hashing'], tasks: ['Assignment 8: Hash tables', 'Collision handling'] },
      { week: 10, topics: ['Software Design', 'Design Patterns'], tasks: ['Project work', 'Design documentation'] },
      { week: 11, topics: ['Version Control', 'Git'], tasks: ['Complete project', 'Project submission'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Code review', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'OOP and basic data structures' },
      { type: 'Project Due', name: 'Software Project', typicalWeek: 11, description: 'Complete software application' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive programming' }
    ],
    textbooks: [
      { title: 'Data Structures and Algorithms in C', author: 'Karumanchi, N.', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: ['Mechanical Engineering', 'Mechatronics']
  },

  'CIS*1500': {
    code: 'CIS*1500',
    name: 'Introduction to Programming',
    credits: 0.5,
    semester: 'Fall/Winter',
    description: 'Introduction to computer programming using a high-level language. Topics include variables, control structures, functions, and basic data structures.',
    prerequisites: [],
    lectureHours: 3,
    labHours: 3,
    weeklyHours: 6,
    learningObjectives: [
      'Write programs using variables and data types',
      'Use control structures (loops, conditionals)',
      'Create and use functions',
      'Work with arrays and strings',
      'Understand basic algorithms',
      'Debug and test programs'
    ],
    assessments: [
      { type: 'Assignment', name: 'Programming Assignments', weight: 40, isRecurring: true, frequency: 'Weekly' },
      { type: 'Lab', name: 'Lab Exercises', weight: 10, isRecurring: true },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Introduction to Programming', 'Variables and Data Types'], tasks: ['Assignment 1: Hello World', 'Lab: Setup environment'] },
      { week: 2, topics: ['Input/Output', 'Basic Operators'], tasks: ['Assignment 2: I/O program', 'Lab: Calculator'] },
      { week: 3, topics: ['Conditional Statements', 'if-else'], tasks: ['Assignment 3: Decision making', 'Lab: Conditionals'] },
      { week: 4, topics: ['Loops', 'while and for'], tasks: ['Assignment 4: Loops', 'Lab: Iteration problems'] },
      { week: 5, topics: ['Functions', 'Parameters'], tasks: ['Assignment 5: Functions', 'Lab: Modular code'] },
      { week: 6, topics: ['Arrays', 'Array Operations'], tasks: ['Assignment 6: Arrays', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Strings'], tasks: ['Midterm exam', 'Lab: String manipulation'] },
      { week: 8, topics: ['File I/O', 'Reading and Writing Files'], tasks: ['Assignment 7: File processing', 'Lab: File operations'] },
      { week: 9, topics: ['Searching Algorithms'], tasks: ['Assignment 8: Search', 'Lab: Linear and binary search'] },
      { week: 10, topics: ['Sorting Algorithms'], tasks: ['Assignment 9: Sorting', 'Lab: Sort implementations'] },
      { week: 11, topics: ['Structures/Records', 'Complex Data'], tasks: ['Assignment 10: Structures', 'Lab: Data organization'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice coding problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Basics through functions and arrays' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive programming exam' }
    ],
    textbooks: [
      { title: 'C Programming: A Modern Approach', author: 'King, K.N.', required: true }
    ],
    requiredFor: ['Mechanical Engineering', 'Biological Engineering', 'Civil Engineering', 'Water Resources Engineering', 'Environmental Engineering'],
    electiveFor: []
  },

  'CIS*2520': {
    code: 'CIS*2520',
    name: 'Data Structures',
    credits: 0.5,
    semester: 'Winter',
    description: 'Advanced data structures including lists, stacks, queues, trees, graphs, and their applications. Analysis of algorithms.',
    prerequisites: ['CIS*2500'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Implement and analyze data structures',
      'Choose appropriate data structures',
      'Analyze algorithm complexity',
      'Implement tree and graph algorithms',
      'Apply recursion effectively',
      'Optimize code performance'
    ],
    assessments: [
      { type: 'Assignment', name: 'Programming Assignments', weight: 50, isRecurring: true, frequency: 'Bi-weekly' },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 30, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Algorithm Analysis', 'Big-O Notation'], tasks: ['Assignment 1: Complexity analysis', 'Time complexity practice'] },
      { week: 2, topics: ['Linked Lists', 'List Operations'], tasks: ['Assignment 2: Linked list implementation', 'List algorithms'] },
      { week: 3, topics: ['Doubly Linked Lists', 'Circular Lists'], tasks: ['Assignment 3: Advanced lists', 'List variations'] },
      { week: 4, topics: ['Stacks', 'Stack Applications'], tasks: ['Assignment 4: Stack implementation', 'Expression evaluation'] },
      { week: 5, topics: ['Queues', 'Priority Queues'], tasks: ['Assignment 5: Queue implementation', 'Queue applications'] },
      { week: 6, topics: ['Binary Trees', 'Tree Traversal'], tasks: ['Assignment 6: Binary trees', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Binary Search Trees'], tasks: ['Midterm exam', 'BST operations'] },
      { week: 8, topics: ['AVL Trees', 'Balanced Trees'], tasks: ['Assignment 7: AVL implementation', 'Balancing algorithms'] },
      { week: 9, topics: ['Heaps', 'Heap Sort'], tasks: ['Assignment 8: Heap implementation', 'Heap applications'] },
      { week: 10, topics: ['Hash Tables', 'Collision Resolution'], tasks: ['Assignment 9: Hash tables', 'Hashing strategies'] },
      { week: 11, topics: ['Graphs', 'Graph Representations'], tasks: ['Assignment 10: Graph ADT', 'Graph traversal'] },
      { week: 12, topics: ['Graph Algorithms', 'Final Review'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Lists through trees' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive data structures' }
    ],
    textbooks: [
      { title: 'Data Structures Using C', author: 'Reema Thareja', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: ['Mechatronics']
  },

  'CIS*2750': {
    code: 'CIS*2750',
    name: 'Software Systems Development',
    credits: 0.5,
    semester: 'Winter',
    description: 'Software development methodologies, design, implementation, testing, and project management. Team-based software project.',
    prerequisites: ['CIS*2520'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Apply software development life cycle',
      'Design software systems',
      'Work in development teams',
      'Use software tools and IDEs',
      'Perform testing and debugging',
      'Manage software projects'
    ],
    assessments: [
      { type: 'Assignment', name: 'Individual Assignments', weight: 25, isRecurring: true },
      { type: 'Project', name: 'Team Software Project', weight: 45, dueWeek: 11 },
      { type: 'Midterm', name: 'Midterm Exam', weight: 15, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 15, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Software Development Life Cycle', 'Requirements'], tasks: ['Form teams', 'Project brainstorming'] },
      { week: 2, topics: ['Requirements Gathering', 'User Stories'], tasks: ['Assignment 1: Requirements doc', 'Project requirements'] },
      { week: 3, topics: ['Software Design', 'UML Diagrams'], tasks: ['Assignment 2: UML', 'Design documents'] },
      { week: 4, topics: ['Design Patterns', 'Architecture'], tasks: ['Assignment 3: Design patterns', 'Architecture design'] },
      { week: 5, topics: ['Version Control', 'Git Workflow'], tasks: ['Setup Git repository', 'Collaborative coding'] },
      { week: 6, topics: ['Testing', 'Unit Tests'], tasks: ['Assignment 4: Unit testing', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Debugging'], tasks: ['Midterm exam', 'Debugging workshop'] },
      { week: 8, topics: ['Code Review', 'Best Practices'], tasks: ['Peer code review', 'Refactoring'] },
      { week: 9, topics: ['Project Management', 'Agile'], tasks: ['Sprint planning', 'Project progress report'] },
      { week: 10, topics: ['Documentation', 'User Manuals'], tasks: ['Write documentation', 'API documentation'] },
      { week: 11, topics: ['Project Presentations'], tasks: ['Project submission', 'Team presentation'] },
      { week: 12, topics: ['Software Maintenance', 'Final Review'], tasks: ['Maintenance plan', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'SDLC through testing' },
      { type: 'Project Due', name: 'Team Software Project', typicalWeek: 11, description: 'Complete team software application' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Software engineering concepts' }
    ],
    textbooks: [
      { title: 'Software Engineering', author: 'Pressman, R.S.', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: ['Mechanical Engineering']
  },

  'CIS*3110': {
    code: 'CIS*3110',
    name: 'Operating Systems I',
    credits: 0.5,
    semester: 'Fall',
    description: 'Operating system principles including processes, threads, scheduling, memory management, and file systems.',
    prerequisites: ['CIS*2520'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Understand OS architecture and components',
      'Analyze process scheduling algorithms',
      'Apply memory management techniques',
      'Understand file systems',
      'Work with system calls',
      'Implement OS concepts in code'
    ],
    assessments: [
      { type: 'Assignment', name: 'OS Programming Assignments', weight: 40, isRecurring: true },
      { type: 'Project', name: 'OS Component Project', weight: 20, dueWeek: 11 },
      { type: 'Midterm', name: 'Midterm Exam', weight: 20, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 20, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['OS Overview', 'System Calls'], tasks: ['Assignment 1: System calls', 'Linux commands'] },
      { week: 2, topics: ['Processes', 'Process Creation'], tasks: ['Assignment 2: Processes', 'Fork/exec practice'] },
      { week: 3, topics: ['Threads', 'Multithreading'], tasks: ['Assignment 3: Threads', 'Threading practice'] },
      { week: 4, topics: ['CPU Scheduling', 'Scheduling Algorithms'], tasks: ['Assignment 4: Scheduling', 'Algorithm analysis'] },
      { week: 5, topics: ['Process Synchronization', 'Mutex and Semaphores'], tasks: ['Assignment 5: Synchronization', 'Concurrent programming'] },
      { week: 6, topics: ['Deadlocks', 'Deadlock Prevention'], tasks: ['Assignment 6: Deadlock scenarios', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Memory Management'], tasks: ['Midterm exam', 'Memory concepts'] },
      { week: 8, topics: ['Paging', 'Segmentation'], tasks: ['Assignment 7: Memory management', 'Address translation'] },
      { week: 9, topics: ['Virtual Memory', 'Page Replacement'], tasks: ['Assignment 8: Virtual memory', 'Page algorithms'] },
      { week: 10, topics: ['File Systems', 'File Organization'], tasks: ['Assignment 9: File systems', 'Project work'] },
      { week: 11, topics: ['I/O Systems', 'Device Drivers'], tasks: ['Complete project', 'I/O concepts'] },
      { week: 12, topics: ['Review and Final Exam Preparation'], tasks: ['Practice problems', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Processes through deadlocks' },
      { type: 'Project Due', name: 'OS Component Project', typicalWeek: 11, description: 'Implement OS component' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'Comprehensive OS concepts' }
    ],
    textbooks: [
      { title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: []
  },

  'CIS*3750': {
    code: 'CIS*3750',
    name: 'System Analysis and Design',
    credits: 0.5,
    semester: 'Fall',
    description: 'Systems analysis and design methodologies including requirements analysis, system modeling, design techniques, and implementation.',
    prerequisites: ['CIS*2750'],
    lectureHours: 3,
    labHours: 2,
    weeklyHours: 5,
    learningObjectives: [
      'Analyze system requirements',
      'Create system models and diagrams',
      'Design system architecture',
      'Apply design methodologies',
      'Evaluate design alternatives',
      'Manage system development projects'
    ],
    assessments: [
      { type: 'Assignment', name: 'Analysis Assignments', weight: 25, isRecurring: true },
      { type: 'Project', name: 'System Design Project', weight: 40, dueWeek: 11 },
      { type: 'Midterm', name: 'Midterm Exam', weight: 15, dueWeek: 7 },
      { type: 'Final Exam', name: 'Final Exam', weight: 20, dueWeek: 12 }
    ],
    weeklyTopics: [
      { week: 1, topics: ['Systems Analysis Introduction', 'Project Selection'], tasks: ['Form teams', 'Select project'] },
      { week: 2, topics: ['Requirements Engineering', 'Stakeholder Analysis'], tasks: ['Assignment 1: Requirements', 'Stakeholder interviews'] },
      { week: 3, topics: ['Use Case Modeling', 'Use Case Diagrams'], tasks: ['Assignment 2: Use cases', 'Create diagrams'] },
      { week: 4, topics: ['Process Modeling', 'Data Flow Diagrams'], tasks: ['Assignment 3: DFDs', 'Process analysis'] },
      { week: 5, topics: ['Data Modeling', 'ER Diagrams'], tasks: ['Assignment 4: Data models', 'Database design'] },
      { week: 6, topics: ['Object-Oriented Analysis', 'Class Diagrams'], tasks: ['Assignment 5: Class diagrams', 'Midterm review'] },
      { week: 7, topics: ['Midterm Exam', 'Design Principles'], tasks: ['Midterm exam', 'Design patterns'] },
      { week: 8, topics: ['Architecture Design', 'System Architecture'], tasks: ['Project work', 'Architecture document'] },
      { week: 9, topics: ['User Interface Design', 'Prototyping'], tasks: ['UI mockups', 'Usability testing'] },
      { week: 10, topics: ['Implementation Strategies', 'Testing Plans'], tasks: ['Project implementation', 'Test planning'] },
      { week: 11, topics: ['Project Presentations'], tasks: ['Project submission', 'Final presentation'] },
      { week: 12, topics: ['System Maintenance', 'Final Review'], tasks: ['Maintenance documentation', 'Final review'] }
    ],
    milestones: [
      { type: 'Midterm', name: 'Midterm Exam', typicalWeek: 7, description: 'Analysis and modeling' },
      { type: 'Project Due', name: 'System Design Project', typicalWeek: 11, description: 'Complete system design with documentation' },
      { type: 'Final Exam', name: 'Final Exam', typicalWeek: 12, description: 'System design concepts' }
    ],
    textbooks: [
      { title: 'Systems Analysis and Design', author: 'Dennis, Wixom, Roth', required: true }
    ],
    requiredFor: ['Computer Engineering', 'Engineering Systems and Computing'],
    electiveFor: []
  }
};

// Combine all courses into one object
export const ALL_COURSES = {
  ...ENGG_COURSES,
  ...MATH_COURSES,
  ...PHYS_COURSES,
  ...CHEM_COURSES,
  ...STAT_COURSES,
  ...CIS_COURSES
};

// Helper function to get course by code
export const getCourse = (code: string): CourseOutline | undefined => {
  return ALL_COURSES[code];
};

// Helper function to get all courses for a specific program
export const getCoursesForProgram = (program: string): CourseOutline[] => {
  return Object.values(ALL_COURSES).filter(course => 
    course.requiredFor.includes(program) || course.requiredFor.includes('All Engineering Programs')
  );
};

// Helper function to get assessments for a course (for grading system)
export const getCourseAssessments = (code: string) => {
  const course = getCourse(code);
  return course?.assessments || [];
};

// Helper function to get weekly topics (for weekly checklist)
export const getWeeklyTopics = (code: string, week: number) => {
  const course = getCourse(code);
  return course?.weeklyTopics.find(w => w.week === week);
};

// Helper function to get upcoming milestones (for reminders)
export const getCourseMilestones = (code: string) => {
  const course = getCourse(code);
  return course?.milestones || [];
};

// Helper function to get all MATH courses
export const getAllMathCourses = () => {
  return Object.values(MATH_COURSES);
};

// Helper function to get all PHYS courses
export const getAllPhysCourses = () => {
  return Object.values(PHYS_COURSES);
};

// Helper function to get all CHEM courses
export const getAllChemCourses = () => {
  return Object.values(CHEM_COURSES);
};

// Helper function to get all CIS courses
export const getAllCISCourses = () => {
  return Object.values(CIS_COURSES);
};

// Helper function to get all ENGG courses
export const getAllENGGCourses = () => {
  return Object.values(ENGG_COURSES);
};

// Helper function to get courses by department
export const getCoursesByDepartment = (department: 'ENGG' | 'MATH' | 'PHYS' | 'CHEM' | 'STAT' | 'CIS') => {
  return Object.values(ALL_COURSES).filter(course => course.code.startsWith(department));
};

export default ALL_COURSES;
