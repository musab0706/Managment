import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Course {
  code: string;
  name: string;
  credits: number;
  completed: boolean;
  isElective?: boolean;
  category?: string;
}

interface Semester {
  name: string;
  courses: Course[];
}

interface ElectiveCategory {
  name: string;
  title: string;
  description: string;
}

interface ProgramRequirements {
  major: string;
  totalCredits: number;
  semesters: Semester[];
  electives: Course[];
  electiveCategories?: ElectiveCategory[];
}

// University of Guelph Program Requirements
const PROGRAM_REQUIREMENTS: { [key: string]: ProgramRequirements } = {
  'Computer Science': {
    major: 'Computer Science',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'PHYS*1070', name: 'Physics I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'CIS*1300', name: 'Programming', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'MATH*1160', name: 'Linear Algebra I', credits: 0.5, completed: false },
          { code: 'STAT*2040', name: 'Statistics I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'CIS*2500', name: 'Intermediate Programming', credits: 0.5, completed: false },
          { code: 'CIS*2520', name: 'Data Structures', credits: 0.5, completed: false },
          { code: 'CIS*2430', name: 'Object Oriented Programming', credits: 0.5, completed: false },
          { code: 'MATH*2000', name: 'Calculus III', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'CIS*2750', name: 'Software Systems Development', credits: 0.5, completed: false },
          { code: 'CIS*2910', name: 'Discrete Structures in Computing I', credits: 0.5, completed: false },
          { code: 'CIS*3090', name: 'Parallel Programming', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'CIS*3110', name: 'Operating Systems I', credits: 0.5, completed: false },
          { code: 'CIS*3490', name: 'Analysis and Design of Algorithms', credits: 0.5, completed: false },
          { code: 'CIS*3750', name: 'System Analysis and Design', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CS_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'CIS*3210', name: 'Computer Networks', credits: 0.5, completed: false },
          { code: 'CIS*3150', name: 'Theory of Computation', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CS_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_CS_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'CIS*4650', name: 'Compilers', credits: 0.5, completed: false },
          { code: 'CIS*4900', name: 'Software Engineering Capstone', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CS_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_CS_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'CIS*4900', name: 'Capstone Project Continuation', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CS_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_CS_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_CS_S8_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'CIS*3190', name: 'Software for Legacy Systems', credits: 0.5, completed: false },
      { code: 'CIS*3760', name: 'Software Engineering', credits: 0.5, completed: false },
      { code: 'CIS*4010', name: 'Artificial Intelligence', credits: 0.5, completed: false },
      { code: 'CIS*4780', name: 'Machine Learning', credits: 0.5, completed: false },
      { code: 'CIS*4820', name: 'Game Programming', credits: 0.5, completed: false },
      { code: 'CIS*3120', name: 'Digital Systems', credits: 0.5, completed: false },
    ],
  },
  'Mechanical Engineering': {
    major: 'Mechanical Engineering',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1140', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
          { code: 'ELECTIVE_S2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ENGG*1070', name: 'Occupational Health and Safety', credits: 0.25, completed: false },
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2120', name: 'Material Science', credits: 0.5, completed: false },
          { code: 'ENGG*2160', name: 'Engineering Mechanics II', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'ENGG*2180', name: 'Introduction to Manufacturing Processes', credits: 0.5, completed: false },
          { code: 'ENGG*2230', name: 'Fluid Mechanics', credits: 0.5, completed: false },
          { code: 'ENGG*2340', name: 'Kinematics and Dynamics', credits: 0.5, completed: false },
          { code: 'ENGG*2450', name: 'Electric Circuits', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*3260', name: 'Thermodynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3280', name: 'Machine Design', credits: 0.75, completed: false },
          { code: 'ENGG*3510', name: 'Electromechanical Devices', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3370', name: 'Applied Fluids and Thermodynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3410', name: 'Systems and Control Theory', credits: 0.5, completed: false },
          { code: 'ENGG*3430', name: 'Heat and Mass Transfer', credits: 0.5, completed: false },
          { code: 'ELECTIVE_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*3140', name: 'Mechanical Vibration', credits: 0.5, completed: false },
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ELECTIVE_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S7_4', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S7_5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4160', name: 'Mechanical Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ELECTIVE_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_S8_3', name: '', credits: 0.75, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      // MECH-1 Electives (3.50 credits)
      { code: 'ENGG*2410', name: 'Digital Systems Design Using Descriptive Languages', credits: 0.5, completed: false },
      { code: 'ENGG*3070', name: 'Integrated Manufacturing Systems', credits: 0.5, completed: false },
      { code: 'ENGG*3080', name: 'Energy Resources and Technologies', credits: 0.5, completed: false },
      { code: 'ENGG*3120', name: 'Computer Aided Design and Manufacturing', credits: 0.75, completed: false },
      { code: 'ENGG*3150', name: 'Engineering Biomechanics', credits: 0.5, completed: false },
      { code: 'ENGG*3170', name: 'Biomaterials', credits: 0.5, completed: false },
      { code: 'ENGG*3250', name: 'Energy Management and Utilization', credits: 0.5, completed: false },
      { code: 'ENGG*3390', name: 'Signal Processing', credits: 0.5, completed: false },
      { code: 'ENGG*3450', name: 'Electronic Devices', credits: 0.5, completed: false },
      { code: 'ENGG*3490', name: 'Introduction to Mechatronic Systems Design', credits: 0.75, completed: false },
      { code: 'ENGG*3640', name: 'Microcomputer Interfacing', credits: 0.5, completed: false },
      { code: 'ENGG*3700', name: 'Optimization for Engineers', credits: 0.5, completed: false },
      { code: 'ENGG*4050', name: 'Quality Control', credits: 0.5, completed: false },
      { code: 'ENGG*4230', name: 'Energy Conversion', credits: 0.75, completed: false },
      { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems', credits: 0.5, completed: false },
      { code: 'ENGG*4440', name: 'Computational Fluid Dynamics', credits: 0.5, completed: false },
      { code: 'ENGG*4460', name: 'Robotic Systems', credits: 0.5, completed: false },
      { code: 'ENGG*4470', name: 'Finite Element Analysis', credits: 0.5, completed: false },
      { code: 'ENGG*4490', name: 'Sampled Data Control Design', credits: 0.75, completed: false },
      { code: 'ENGG*4510', name: 'Assessment and Management of Risk', credits: 0.5, completed: false },
      { code: 'ENGG*4660', name: 'Medical Image Processing', credits: 0.5, completed: false },
      
      // MECH 1: Solid Mechanics & Thermal Systems
      { code: 'ENGG*2550', name: 'Engineering Materials', credits: 0.5, completed: false, category: 'MECH 1' },
      { code: 'ENGG*3080', name: 'Energy Resources and Technologies', credits: 0.5, completed: false, category: 'MECH 1' },
      { code: 'ENGG*3150', name: 'Engineering Biomechanics', credits: 0.5, completed: false, category: 'MECH 1' },
      { code: 'ENGG*3170', name: 'Biomaterials', credits: 0.5, completed: false, category: 'MECH 1' },
      { code: 'ENGG*3250', name: 'Energy Management and Utilization', credits: 0.5, completed: false, category: 'MECH 1' },
      { code: 'ENGG*4230', name: 'Energy Conversion', credits: 0.75, completed: false, category: 'MECH 1' },
      { code: 'ENGG*4470', name: 'Finite Element Analysis', credits: 0.5, completed: false, category: 'MECH 1' },
      { code: 'ENGG*4580', name: 'Sustainable Energy Systems Design', credits: 0.75, completed: false, category: 'MECH 1' },
      
      // MECH 2: Control Systems & Manufacturing
      { code: 'ENGG*3120', name: 'Computer Aided Design and Manufacturing', credits: 0.75, completed: false, category: 'MECH 2' },
      { code: 'ENGG*3700', name: 'Optimization for Engineers', credits: 0.5, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4030', name: 'Manufacturing System Design', credits: 0.75, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4050', name: 'Quality Control', credits: 0.5, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4220', name: 'Interdisciplinary Mechanical Engineering Design', credits: 0.75, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4400', name: 'Biomechanical Engineering Design', credits: 0.75, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4440', name: 'Computational Fluid Dynamics', credits: 0.5, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4490', name: 'Sampled Data Control Design', credits: 0.75, completed: false, category: 'MECH 2' },
      { code: 'ENGG*4510', name: 'Assessment and Management of Risk', credits: 0.5, completed: false, category: 'MECH 2' },
      
      // CSE: Computer Science & Engineering (2.00 credits from Complementary Studies Electives)
      { code: 'CIS*2500', name: 'Intermediate Programming', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'CIS*2520', name: 'Data Structures', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'CIS*2750', name: 'Software Systems Development', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'CIS*3110', name: 'Operating Systems I', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'CIS*3490', name: 'Analysis and Design of Algorithms', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'ENGG*3390', name: 'Signal Processing', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'ENGG*3450', name: 'Electronic Devices', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'ENGG*3490', name: 'Introduction to Mechatronic Systems Design', credits: 0.75, completed: false, category: 'CSE' },
      { code: 'ENGG*3640', name: 'Microcomputer Interfacing', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'ENGG*4460', name: 'Robotic Systems', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'ENGG*4480', name: 'Advanced Mechatronic Systems Design', credits: 0.75, completed: false, category: 'CSE' },
      { code: 'ENGG*4660', name: 'Medical Image Processing', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'STAT*2040', name: 'Statistics I', credits: 0.5, completed: false, category: 'CSE' },
      { code: 'STAT*2120', name: 'Probability and Applied Statistics I', credits: 0.5, completed: false, category: 'CSE' },
    ],
    electiveCategories: [
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Computer Science, Statistics, and related courses' },
      { name: 'MECH 1', title: '3.50 credits of Mechanical Engineering Electives, List MECH-1', description: 'Solid mechanics, thermal systems, and materials' },
      { name: 'MECH 2', title: '0.75 credits of Mechanical Engineering Design Electives, List MECH-2', description: 'Control systems, manufacturing, and design projects' },
    ],
  },
  'Biomedical Engineering': {
    major: 'Biomedical Engineering',
    totalCredits: 23.75,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ENGG*2160', name: 'Engineering Mechanics II', credits: 0.5, completed: false },
          { code: 'ENGG*2230', name: 'Fluid Mechanics', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BME_S3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'BIOL*1080', name: 'Biological Concepts of Health', credits: 0.5, completed: false },
          { code: 'BIOM*2000', name: 'Concepts in Human Physiology', credits: 0.5, completed: false },
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2120', name: 'Material Science', credits: 0.5, completed: false },
          { code: 'ENGG*2450', name: 'Electric Circuits', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'BIOM*3010', name: 'Biomedical Comparative Anatomy', credits: 0.5, completed: false },
          { code: 'ENGG*3260', name: 'Thermodynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3390', name: 'Signal Processing', credits: 0.5, completed: false },
          { code: 'ENGG*3450', name: 'Electronic Devices', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BME_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3170', name: 'Biomaterials', credits: 0.5, completed: false },
          { code: 'ENGG*3410', name: 'Systems and Control Theory', credits: 0.5, completed: false },
          { code: 'ENGG*3430', name: 'Heat and Mass Transfer', credits: 0.5, completed: false },
          { code: 'PATH*3610', name: 'Principles of Disease', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BME_S6', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ENGG*4390', name: 'Bio-instrumentation Design', credits: 0.75, completed: false },
          { code: 'ELECTIVE_BME_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BME_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BME_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BME_S7_4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4180', name: 'Biomedical Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ELECTIVE_BME_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BME_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BME_S8_3', name: '', credits: 0.75, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ENGG*2660', name: 'Biological Engineering Systems I', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*3150', name: 'Engineering Biomechanics', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*3160', name: 'Biological Engineering Systems II', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*3700', name: 'Optimization for Engineers', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*4460', name: 'Robotic Systems', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*4510', name: 'Assessment and Management of Risk', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*4660', name: 'Medical Image Processing', credits: 0.5, completed: false, category: 'BME-1' },
      { code: 'ENGG*4400', name: 'Biomechanical Engineering Design', credits: 0.75, completed: false, category: 'BME-2' },
      { code: 'ENGG*4580', name: 'Sustainable Energy Systems Design', credits: 0.75, completed: false, category: 'BME-2' },
    ],
    electiveCategories: [
      { name: 'BME-1', title: '2.50 credits from BME-1 Biomedical Engineering Electives', description: 'Biomedical engineering technical electives' },
      { name: 'BME-2', title: '0.75 credits from BME-2 Biomedical Engineering Design Electives', description: 'Design-focused biomedical engineering electives' },
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
  'Biological Science': {
    major: 'Biological Science',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'BIOL*1030', name: 'Biology I', credits: 0.5, completed: false },
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'MATH*1080', name: 'Elements of Calculus I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'BIOL*1040', name: 'Biology II', credits: 0.5, completed: false },
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'MATH*1160', name: 'Linear Algebra I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'BIOL*2060', name: 'Ecology', credits: 0.5, completed: false },
          { code: 'BIOL*2400', name: 'Genetics', credits: 0.5, completed: false },
          { code: 'CHEM*2480', name: 'Organic Chemistry I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'MBG*2040', name: 'Genetics', credits: 0.5, completed: false },
          { code: 'BIOC*2580', name: 'Introduction to Biochemistry', credits: 0.5, completed: false },
          { code: 'MICR*2420', name: 'Introductory Microbiology', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'MBG*3300', name: 'Molecular Biology', credits: 0.5, completed: false },
          { code: 'BOT*2100', name: 'Plant Biodiversity', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIO_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIO_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ZOO*2090', name: 'Animal Diversity', credits: 0.5, completed: false },
          { code: 'MICR*3230', name: 'General Virology', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIO_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIO_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'BIOL*4500', name: 'Biology Research Project I', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIO_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIO_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIO_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'BIOL*4510', name: 'Biology Research Project II', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIO_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIO_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ZOO*3200', name: 'Animal Behaviour', credits: 0.5, completed: false },
      { code: 'NEUR*2000', name: 'Neurobiology', credits: 0.5, completed: false },
      { code: 'TOX*2000', name: 'Introduction to Toxicology', credits: 0.5, completed: false },
    ],
  },
  'Business Administration': {
    major: 'Business Administration',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'BUS*1200', name: 'Introduction to Business Management', credits: 0.5, completed: false },
          { code: 'ECON*1050', name: 'Introductory Microeconomics', credits: 0.5, completed: false },
          { code: 'ACCT*1220', name: 'Introductory Financial Accounting', credits: 0.5, completed: false },
          { code: 'MATH*1030', name: 'Business Mathematics', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'ACCT*1240', name: 'Applied Financial Accounting', credits: 0.5, completed: false },
          { code: 'ECON*1100', name: 'Introductory Macroeconomics', credits: 0.5, completed: false },
          { code: 'BUS*2230', name: 'Management I', credits: 0.5, completed: false },
          { code: 'STAT*2060', name: 'Statistics for Business Decisions', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ACCT*2230', name: 'Management Accounting', credits: 0.5, completed: false },
          { code: 'BUS*2650', name: 'Human Resources Management', credits: 0.5, completed: false },
          { code: 'ECON*2770', name: 'Quantitative Methods', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'BUS*3200', name: 'Marketing Management', credits: 0.5, completed: false },
          { code: 'BUS*3400', name: 'Operations Management', credits: 0.5, completed: false },
          { code: 'ECON*2410', name: 'Money and Banking', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'BUS*3500', name: 'Financial Management', credits: 0.5, completed: false },
          { code: 'BUS*3700', name: 'Business Strategy', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BUS_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BUS_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'BUS*4000', name: 'International Business', credits: 0.5, completed: false },
          { code: 'BUS*4200', name: 'Entrepreneurship', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BUS_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BUS_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'BUS*4700', name: 'Strategic Management', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BUS_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BUS_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BUS_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'BUS*4900', name: 'Business Capstone', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BUS_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BUS_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'BUS*3300', name: 'Consumer Behaviour', credits: 0.5, completed: false },
      { code: 'ECON*2310', name: 'Economic Development', credits: 0.5, completed: false },
      { code: 'BUS*3850', name: 'Leadership Development', credits: 0.5, completed: false },
    ],
  },
  'Psychology': {
    major: 'Psychology',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'PSYC*1000', name: 'Introductory Psychology', credits: 0.5, completed: false },
          { code: 'BIOL*1030', name: 'Biology I', credits: 0.5, completed: false },
          { code: 'MATH*1080', name: 'Elements of Calculus I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'PSYC*2410', name: 'Social Psychology', credits: 0.5, completed: false },
          { code: 'PSYC*2360', name: 'Personality', credits: 0.5, completed: false },
          { code: 'STAT*2080', name: 'Introductory Applied Statistics I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'PSYC*2650', name: 'Cognitive Psychology', credits: 0.5, completed: false },
          { code: 'PSYC*2740', name: 'Developmental Psychology', credits: 0.5, completed: false },
          { code: 'NEUR*2000', name: 'Neurobiology', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'PSYC*3100', name: 'Research Methods', credits: 0.5, completed: false },
          { code: 'PSYC*3250', name: 'Abnormal Psychology', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'PSYC*3400', name: 'Health Psychology', credits: 0.5, completed: false },
          { code: 'PSYC*3450', name: 'Psychological Testing', credits: 0.5, completed: false },
          { code: 'ELECTIVE_PSY_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_PSY_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'PSYC*3700', name: 'Clinical Psychology', credits: 0.5, completed: false },
          { code: 'PSYC*3850', name: 'Organizational Psychology', credits: 0.5, completed: false },
          { code: 'ELECTIVE_PSY_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_PSY_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'PSYC*4500', name: 'Psychology Research Seminar', credits: 0.5, completed: false },
          { code: 'ELECTIVE_PSY_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_PSY_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_PSY_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'PSYC*4900', name: 'Advanced Research Project', credits: 0.5, completed: false },
          { code: 'ELECTIVE_PSY_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_PSY_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'PSYC*3550', name: 'Learning and Behaviour', credits: 0.5, completed: false },
      { code: 'PSYC*3770', name: 'Psychology of Gender', credits: 0.5, completed: false },
      { code: 'SOC*2080', name: 'Social Inequality', credits: 0.5, completed: false },
    ],
  },
  'Environmental Science': {
    major: 'Environmental Science',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'ENVS*1030', name: 'Environmental Science', credits: 0.5, completed: false },
          { code: 'BIOL*1030', name: 'Biology I', credits: 0.5, completed: false },
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'MATH*1080', name: 'Elements of Calculus I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'ENVS*2060', name: 'Environmental Citizenship', credits: 0.5, completed: false },
          { code: 'BIOL*1040', name: 'Biology II', credits: 0.5, completed: false },
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'GEOG*1300', name: 'Earth Systems', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'BIOL*2060', name: 'Ecology', credits: 0.5, completed: false },
          { code: 'CROP*2240', name: 'Soil Science', credits: 0.5, completed: false },
          { code: 'GEOG*2210', name: 'Environment and Resources', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'ENVS*3000', name: 'Environmental Assessment', credits: 0.5, completed: false },
          { code: 'STAT*2080', name: 'Introductory Applied Statistics I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENVS*3200', name: 'Environmental Toxicology', credits: 0.5, completed: false },
          { code: 'GEOG*2460', name: 'Introduction to GIS', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ENV_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENV_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENVS*3500', name: 'Environmental Policy', credits: 0.5, completed: false },
          { code: 'TOX*2000', name: 'Introduction to Toxicology', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ENV_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENV_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENVS*4000', name: 'Environmental Science Thesis I', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ENV_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENV_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENV_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENVS*4010', name: 'Environmental Science Thesis II', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ENV_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENV_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ENGG*3280', name: 'Hydrology and Water Resources', credits: 0.5, completed: false },
      { code: 'FOOD*2010', name: 'Principles of Food Science', credits: 0.5, completed: false },
      { code: 'ANSC*1210', name: 'Introduction to Animal Science', credits: 0.5, completed: false },
    ],
  },
  'Biochemistry': {
    major: 'Biochemistry',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'BIOL*1030', name: 'Biology I', credits: 0.5, completed: false },
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Physics', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'BIOL*1040', name: 'Biology II', credits: 0.5, completed: false },
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1020', name: 'Introductory Physics II', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'CHEM*2060', name: 'Structure and Bonding', credits: 0.5, completed: false },
          { code: 'CHEM*2480', name: 'Organic Chemistry I', credits: 0.5, completed: false },
          { code: 'BIOC*2580', name: 'Introduction to Biochemistry', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'BIOC*3560', name: 'Molecular Biology', credits: 0.5, completed: false },
          { code: 'MBG*2040', name: 'Genetics', credits: 0.5, completed: false },
          { code: 'CHEM*2700', name: 'Analytical Chemistry', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'BIOC*3570', name: 'Protein Structure and Function', credits: 0.5, completed: false },
          { code: 'BIOC*4580', name: 'Advanced Biochemistry', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOC_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOC_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'MBG*3300', name: 'Molecular Biology', credits: 0.5, completed: false },
          { code: 'CHEM*3800', name: 'Instrumental Methods', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOC_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOC_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'BIOC*4900', name: 'Biochemistry Research Project I', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOC_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOC_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOC_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'BIOC*4910', name: 'Biochemistry Research Project II', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOC_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOC_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'MICR*2420', name: 'Introductory Microbiology', credits: 0.5, completed: false },
      { code: 'MICR*3230', name: 'General Virology', credits: 0.5, completed: false },
      { code: 'NUTR*3090', name: 'Nutrition Through the Life Cycle', credits: 0.5, completed: false },
    ],
  },
  'Applied Mathematics': {
    major: 'Applied Mathematics',
    totalCredits: 20,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'MATH*1160', name: 'Linear Algebra I', credits: 0.5, completed: false },
          { code: 'PHYS*1070', name: 'Physics I', credits: 0.5, completed: false },
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'MATH*2150', name: 'Discrete Structures', credits: 0.5, completed: false },
          { code: 'PHYS*1080', name: 'Physics II', credits: 0.5, completed: false },
          { code: 'STAT*2040', name: 'Statistics I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'MATH*2000', name: 'Calculus III', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Differential Equations', credits: 0.5, completed: false },
          { code: 'MATH*2200', name: 'Advanced Calculus I', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Applied Statistics I', credits: 0.5, completed: false },
          { code: 'MATH*3200', name: 'Real Analysis', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'MATH*3300', name: 'Abstract Algebra', credits: 0.5, completed: false },
          { code: 'MATH*3500', name: 'Numerical Analysis', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MATH_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MATH_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'MATH*4100', name: 'Advanced Analysis', credits: 0.5, completed: false },
          { code: 'MATH*4200', name: 'Applied Mathematics', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MATH_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MATH_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'MATH*4800', name: 'Mathematics Research Project I', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MATH_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MATH_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MATH_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'MATH*4810', name: 'Mathematics Research Project II', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MATH_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MATH_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'CIS*2520', name: 'Data Structures', credits: 0.5, completed: false },
      { code: 'ECON*2770', name: 'Quantitative Methods', credits: 0.5, completed: false },
      { code: 'PHYS*1300', name: 'Wave Motion and Electricity', credits: 0.5, completed: false },
    ],
  },
  'Computer Engineering': {
    major: 'Computer Engineering',
    totalCredits: 23.5,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1140', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1410', name: 'Introductory Programming for Engineers', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'ENGG*1420', name: 'Object-Oriented Programming for Engineers', credits: 0.5, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'CIS*2520', name: 'Data Structures', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'ENGG*2410', name: 'Digital Systems Design Using Descriptive Languages', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CENG_S3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'CIS*2910', name: 'Discrete Structures in Computing II', credits: 0.5, completed: false },
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2450', name: 'Electric Circuits', credits: 0.5, completed: false },
          { code: 'ENGG*3380', name: 'Computer Organization and Design', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CENG_S4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3390', name: 'Signal Processing', credits: 0.5, completed: false },
          { code: 'ENGG*3450', name: 'Electronic Devices', credits: 0.5, completed: false },
          { code: 'ENGG*3640', name: 'Microcomputer Interfacing', credits: 0.5, completed: false },
          { code: 'ENGG*4450', name: 'Large-Scale Software Architecture Engineering', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CENG_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'CIS*3110', name: 'Operating Systems I', credits: 0.5, completed: false },
          { code: 'CIS*3490', name: 'The Analysis and Design of Computer Algorithms', credits: 0.5, completed: false },
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3210', name: 'Communication Systems', credits: 0.5, completed: false },
          { code: 'ENGG*3410', name: 'Systems and Control Theory', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CENG_S6', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*3050', name: 'Embedded Reconfigurable Computing Systems', credits: 0.5, completed: false },
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ENGG*4420', name: 'Real-time Systems Design', credits: 0.75, completed: false },
          { code: 'ELECTIVE_CENG_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_CENG_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4170', name: 'Computer Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ENGG*4540', name: 'Advanced Computer Architecture', credits: 0.5, completed: false },
          { code: 'ENGG*4550', name: 'VLSI Digital Design', credits: 0.5, completed: false },
          { code: 'ELECTIVE_CENG_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_CENG_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'CIS*2750', name: 'Software Systems Development and Integration', credits: 0.5, completed: false, category: 'CENG-1' },
      { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems', credits: 0.5, completed: false, category: 'CENG-1' },
      { code: 'ENGG*4460', name: 'Robotic Systems', credits: 0.5, completed: false, category: 'CENG-1' },
      { code: 'ENGG*4490', name: 'Sampled Data Control Design', credits: 0.75, completed: false, category: 'CENG-1' },
      { code: 'ENGG*4660', name: 'Medical Image Processing', credits: 0.5, completed: false, category: 'CENG-1' },
      { code: 'ENGG*3090', name: 'Digital Systems and Microcontroller Interfacing', credits: 0.5, completed: false, category: 'CENG-1' },
      { code: 'ENGG*4210', name: 'Machine Learning', credits: 0.5, completed: false, category: 'CENG-1' },
    ],
    electiveCategories: [
      { name: 'CENG-1', title: '2.00 credits from CENG-1 Computer Engineering Electives', description: 'Computer engineering technical electives' },
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
  'Mechatronics Engineering': {
    major: 'Mechatronics Engineering',
    totalCredits: 22.75,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1140', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1410', name: 'Introductory Programming for Engineers', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'ENGG*2120', name: 'Material Science', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ENGG*2160', name: 'Engineering Mechanics II', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'ENGG*2450', name: 'Electric Circuits', credits: 0.5, completed: false },
          { code: 'ENGG*2910', name: 'Mathematics for Artificial Intelligence', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2180', name: 'Introduction to Manufacturing Processes', credits: 0.5, completed: false },
          { code: 'ENGG*2340', name: 'Kinematics and Dynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3450', name: 'Electronic Devices', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3090', name: 'Digital Systems and Microcontroller Interfacing', credits: 0.5, completed: false },
          { code: 'ENGG*3390', name: 'Signal Processing', credits: 0.5, completed: false },
          { code: 'ENGG*3410', name: 'Systems and Control Theory', credits: 0.5, completed: false },
          { code: 'ENGG*3510', name: 'Electromechanical Devices', credits: 0.5, completed: false },
          { code: 'ENGG*3600', name: 'Introduction to Thermal-Fluid Sciences', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MTE_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENGG*3040', name: 'Mechatronic Systems Design I', credits: 0.75, completed: false },
          { code: 'ENGG*3060', name: 'Machine Elements', credits: 0.5, completed: false },
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MTE_S6', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ENGG*4210', name: 'Machine Learning', credits: 0.5, completed: false },
          { code: 'ENGG*4590', name: 'Sensors Instrumentation and Measurements', credits: 0.5, completed: false },
          { code: 'ELECTIVE_MTE_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MTE_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MTE_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4190', name: 'Mechatronics Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ENGG*4690', name: 'Mechatronic Systems Design II', credits: 0.75, completed: false },
          { code: 'ELECTIVE_MTE_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_MTE_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ENGG*4460', name: 'Robotic Systems', credits: 0.5, completed: false, category: 'Robotics-Control-AI' },
      { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems', credits: 0.5, completed: false, category: 'Robotics-Control-AI' },
      { code: 'ENGG*4740', name: 'Computational Methods for Data Analysis', credits: 0.5, completed: false, category: 'Robotics-Control-AI' },
      { code: 'ENGG*4490', name: 'Sampled Data Control Design', credits: 0.75, completed: false, category: 'Robotics-Control-AI' },
      { code: 'ENGG*3070', name: 'Integrated Manufacturing Systems', credits: 0.5, completed: false, category: 'Manufacturing-Automation' },
      { code: 'ENGG*3120', name: 'Computer Aided Design and Manufacturing', credits: 0.75, completed: false, category: 'Manufacturing-Automation' },
      { code: 'ENGG*4470', name: 'Finite Element Analysis', credits: 0.5, completed: false, category: 'Manufacturing-Automation' },
      { code: 'ENGG*3140', name: 'Mechanical Vibration', credits: 0.5, completed: false, category: 'Manufacturing-Automation' },
    ],
    electiveCategories: [
      { name: 'Robotics-Control-AI', title: 'Robotics-Control-AI Area of Emphasis (1.50 credits)', description: 'Robotic systems, AI, soft computing, and control design' },
      { name: 'Manufacturing-Automation', title: 'Manufacturing-Automation Area of Emphasis (1.50 credits)', description: 'Manufacturing systems, CAD/CAM, vibration, and FEA' },
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
  'Water Resources Engineering': {
    major: 'Water Resources Engineering',
    totalCredits: 23.5,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ENGG*2130', name: 'Introduction to Environmental Engineering', credits: 0.5, completed: false },
          { code: 'ENGG*2230', name: 'Fluid Mechanics', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'GEOG*2000', name: 'Geomorphology', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2120', name: 'Material Science', credits: 0.5, completed: false },
          { code: 'ENGG*2560', name: 'Environmental Engineering Systems', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
          { code: 'BIOL*1090', name: 'Introduction to Molecular and Cellular Biology', credits: 0.5, completed: false },
          { code: 'ELECTIVE_WRE_S4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*3260', name: 'Thermodynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3590', name: 'Water Quality', credits: 0.5, completed: false },
          { code: 'ENGG*3650', name: 'Hydrology and Hydraulics', credits: 0.5, completed: false },
          { code: 'ENGG*3670', name: 'Soil Mechanics and Site Characterization', credits: 0.5, completed: false },
          { code: 'ELECTIVE_WRE_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3220', name: 'Groundwater Engineering', credits: 0.5, completed: false },
          { code: 'ENGG*3430', name: 'Heat and Mass Transfer', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_WRE_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_WRE_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*3340', name: 'Geographic Information Systems in Environmental Engineering', credits: 0.5, completed: false },
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ENGG*4360', name: 'Soil-Water Conservation Systems Design', credits: 0.75, completed: false },
          { code: 'ENGG*4370', name: 'Urban Water Systems Design', credits: 0.75, completed: false },
          { code: 'ELECTIVE_WRE_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_WRE_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4150', name: 'Water Resources Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ENGG*4250', name: 'Watershed Systems Design', credits: 0.75, completed: false },
          { code: 'ELECTIVE_WRE_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_WRE_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ENGG*3080', name: 'Energy Resources and Technologies', credits: 0.5, completed: false, category: 'WRE-1' },
      { code: 'ENGG*4240', name: 'Site Remediation', credits: 0.5, completed: false, category: 'WRE-1' },
      { code: 'ENGG*4510', name: 'Assessment and Management of Risk', credits: 0.5, completed: false, category: 'WRE-1' },
      { code: 'ENGG*4760', name: 'Biological Wastewater Treatment Design', credits: 0.5, completed: false, category: 'WRE-2' },
      { code: 'ENGG*4770', name: 'Physical and Chemical Water Treatment Design', credits: 0.5, completed: false, category: 'WRE-2' },
      { code: 'ENGG*4340', name: 'Solid and Hazardous Waste Management', credits: 0.5, completed: false, category: 'WRE-2' },
      { code: 'ENGG*3180', name: 'Air Quality', credits: 0.5, completed: false, category: 'WRE-2' },
    ],
    electiveCategories: [
      { name: 'WRE-1', title: '1.00 credits from WRE-1 Water Resources Engineering Electives', description: 'Water resources technical electives' },
      { name: 'WRE-2', title: '1.00 credits from WRE-2 Environmental and Water Resources Electives', description: 'Environmental and water resources electives' },
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
  'Environmental Engineering': {
    major: 'Environmental Engineering',
    totalCredits: 23.5,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2120', name: 'Material Science', credits: 0.5, completed: false },
          { code: 'ENGG*2130', name: 'Introduction to Environmental Engineering', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'BIOL*1090', name: 'Introduction to Molecular and Cellular Biology', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'ENGG*2230', name: 'Fluid Mechanics', credits: 0.5, completed: false },
          { code: 'ENGG*2560', name: 'Environmental Engineering Systems', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ENVE_S4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3180', name: 'Air Quality', credits: 0.5, completed: false },
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*3260', name: 'Thermodynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3590', name: 'Water Quality', credits: 0.5, completed: false },
          { code: 'ENGG*3650', name: 'Hydrology and Hydraulics', credits: 0.5, completed: false },
          { code: 'ENGG*3670', name: 'Soil Mechanics and Site Characterization', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3220', name: 'Groundwater Engineering', credits: 0.5, completed: false },
          { code: 'ENGG*3430', name: 'Heat and Mass Transfer', credits: 0.5, completed: false },
          { code: 'ENGG*3440', name: 'Process Control', credits: 0.5, completed: false },
          { code: 'ENGG*3470', name: 'Mass Transfer Operations', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ENVE_S6', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ENGG*4340', name: 'Solid and Hazardous Waste Management', credits: 0.5, completed: false },
          { code: 'ENGG*4370', name: 'Urban Water Systems Design', credits: 0.75, completed: false },
          { code: 'ELECTIVE_ENVE_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENVE_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENVE_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4130', name: 'Environmental Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ELECTIVE_ENVE_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENVE_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENVE_S8_3', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ENVE_S8_4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ENGG*4070', name: 'Life Cycle Assessment for Sustainable Design', credits: 0.5, completed: false, category: 'ENVE-1' },
      { code: 'ENGG*4240', name: 'Site Remediation', credits: 0.5, completed: false, category: 'ENVE-1' },
      { code: 'ENGG*4510', name: 'Assessment and Management of Risk', credits: 0.5, completed: false, category: 'ENVE-1' },
      { code: 'ENGG*4760', name: 'Biological Wastewater Treatment Design', credits: 0.5, completed: false, category: 'ENVE-2' },
      { code: 'ENGG*4770', name: 'Physical and Chemical Water Treatment Design', credits: 0.5, completed: false, category: 'ENVE-2' },
      { code: 'ENGG*4810', name: 'Control of Atmospheric Particulates', credits: 0.5, completed: false, category: 'ENVE-2' },
      { code: 'ENGG*4820', name: 'Atmospheric Emission Control: Combustion Systems', credits: 0.5, completed: false, category: 'ENVE-2' },
      { code: 'ENGG*3340', name: 'GIS in Environmental Engineering', credits: 0.5, completed: false, category: 'ENVE-2' },
    ],
    electiveCategories: [
      { name: 'ENVE-1', title: '1.00 credits from ENVE-1 Environmental Engineering Electives', description: 'Environmental engineering technical electives' },
      { name: 'ENVE-2', title: '2.00 credits from ENVE-2 Environmental Engineering Electives', description: 'Specialized environmental engineering electives' },
      { name: 'CSE', title: '1.50 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
  'Biological Engineering': {
    major: 'Biological Engineering',
    totalCredits: 23.25,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1040', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'CHEM*1050', name: 'General Chemistry II', credits: 0.5, completed: false },
          { code: 'CIS*1500', name: 'Introduction to Programming', credits: 0.5, completed: false },
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2120', name: 'Material Science', credits: 0.5, completed: false },
          { code: 'ENGG*2230', name: 'Fluid Mechanics', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'BIOL*1090', name: 'Introduction to Molecular and Cellular Biology', credits: 0.5, completed: false },
          { code: 'ENGG*2560', name: 'Environmental Engineering Systems', credits: 0.5, completed: false },
          { code: 'ENGG*2660', name: 'Biological Engineering Systems I', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOE_S4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3160', name: 'Biological Engineering Systems II', credits: 0.5, completed: false },
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*3260', name: 'Thermodynamics', credits: 0.5, completed: false },
          { code: 'ENGG*3430', name: 'Heat and Mass Transfer', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOE_S5', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3270', name: 'Food Quality and Food Processing', credits: 0.5, completed: false },
          { code: 'ENGG*3340', name: 'GIS in Environmental Engineering', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOE_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOE_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ENGG*4070', name: 'Life Cycle Assessment for Sustainable Design', credits: 0.5, completed: false },
          { code: 'ELECTIVE_BIOE_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOE_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOE_S7_3', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOE_S7_4', name: '', credits: 0.75, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4110', name: 'Biological Engineering Design IV', credits: 1.0, completed: false },
          { code: 'ELECTIVE_BIOE_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOE_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_BIOE_S8_3', name: '', credits: 0.75, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'ENGG*3150', name: 'Engineering Biomechanics', credits: 0.5, completed: false, category: 'BIOE-1' },
      { code: 'ENGG*3080', name: 'Energy Resources and Technologies', credits: 0.5, completed: false, category: 'BIOE-1' },
      { code: 'ENGG*3470', name: 'Mass Transfer Operations', credits: 0.5, completed: false, category: 'BIOE-1' },
      { code: 'ENGG*4510', name: 'Assessment and Management of Risk', credits: 0.5, completed: false, category: 'BIOE-1' },
      { code: 'ENGG*3590', name: 'Water Quality', credits: 0.5, completed: false, category: 'BIOE-2' },
      { code: 'ENGG*3650', name: 'Hydrology and Hydraulics', credits: 0.5, completed: false, category: 'BIOE-2' },
      { code: 'ENGG*4340', name: 'Solid and Hazardous Waste Management', credits: 0.5, completed: false, category: 'BIOE-2' },
    ],
    electiveCategories: [
      { name: 'BIOE-1', title: '1.50 credits from BIOE-1 Biological Engineering Electives', description: 'Biological engineering technical electives' },
      { name: 'BIOE-2', title: '1.00 credits from BIOE-2 Biological Engineering Electives', description: 'Environmental and biological electives' },
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
  'Engineering Systems and Computing': {
    major: 'Engineering Systems and Computing',
    totalCredits: 23.5,
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          { code: 'CHEM*1140', name: 'General Chemistry I', credits: 0.5, completed: false },
          { code: 'ENGG*1100', name: 'Engineering and Design I', credits: 0.75, completed: false },
          { code: 'ENGG*1410', name: 'Introductory Programming for Engineers', credits: 0.5, completed: false },
          { code: 'MATH*1200', name: 'Calculus I', credits: 0.5, completed: false },
          { code: 'PHYS*1130', name: 'Physics with Applications', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          { code: 'ENGG*1210', name: 'Engineering Mechanics I', credits: 0.5, completed: false },
          { code: 'ENGG*1420', name: 'Object-Oriented Programming for Engineers', credits: 0.5, completed: false },
          { code: 'ENGG*1500', name: 'Engineering Analysis', credits: 0.5, completed: false },
          { code: 'MATH*1210', name: 'Calculus II', credits: 0.5, completed: false },
          { code: 'PHYS*1010', name: 'Introductory Electricity and Magnetism', credits: 0.5, completed: false },
        ],
      },
      {
        name: 'Semester 3',
        courses: [
          { code: 'CIS*2520', name: 'Data Structures', credits: 0.5, completed: false },
          { code: 'ENGG*2400', name: 'Engineering Systems Analysis', credits: 0.5, completed: false },
          { code: 'ENGG*2410', name: 'Digital Systems Design Using Descriptive Languages', credits: 0.5, completed: false },
          { code: 'MATH*2270', name: 'Applied Differential Equations', credits: 0.5, completed: false },
          { code: 'STAT*2120', name: 'Probability and Statistics for Engineers', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ESC_S3', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 4',
        courses: [
          { code: 'CIS*2910', name: 'Discrete Structures in Computing II', credits: 0.5, completed: false },
          { code: 'ENGG*2100', name: 'Engineering and Design II', credits: 0.75, completed: false },
          { code: 'ENGG*2450', name: 'Electric Circuits', credits: 0.5, completed: false },
          { code: 'ENGG*3380', name: 'Computer Organization and Design', credits: 0.5, completed: false },
          { code: 'MATH*2130', name: 'Numerical Methods', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ESC_S4', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 5',
        courses: [
          { code: 'ENGG*3390', name: 'Signal Processing', credits: 0.5, completed: false },
          { code: 'ENGG*3450', name: 'Electronic Devices', credits: 0.5, completed: false },
          { code: 'ENGG*3640', name: 'Microcomputer Interfacing', credits: 0.5, completed: false },
          { code: 'HIST*1250', name: 'Science and Technology in a Global Context', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ESC_S5_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S5_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 6',
        courses: [
          { code: 'CIS*3110', name: 'Operating Systems I', credits: 0.5, completed: false },
          { code: 'ENGG*3100', name: 'Engineering and Design III', credits: 0.75, completed: false },
          { code: 'ENGG*3210', name: 'Communication Systems', credits: 0.5, completed: false },
          { code: 'ENGG*3410', name: 'Systems and Control Theory', credits: 0.5, completed: false },
          { code: 'ELECTIVE_ESC_S6_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S6_2', name: '', credits: 0.5, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 7',
        courses: [
          { code: 'ENGG*3050', name: 'Embedded Reconfigurable Computing Systems', credits: 0.5, completed: false },
          { code: 'ENGG*3240', name: 'Engineering Economics', credits: 0.5, completed: false },
          { code: 'ENGG*4000', name: 'Proposal for Engineering Design IV', credits: 0, completed: false },
          { code: 'ELECTIVE_ESC_S7_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S7_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S7_3', name: '', credits: 0.75, completed: false, isElective: true },
        ],
      },
      {
        name: 'Semester 8',
        courses: [
          { code: 'ENGG*4200', name: 'Engineering Systems and Computing Design IV', credits: 1.0, completed: false },
          { code: 'ELECTIVE_ESC_S8_1', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S8_2', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S8_3', name: '', credits: 0.5, completed: false, isElective: true },
          { code: 'ELECTIVE_ESC_S8_4', name: '', credits: 0.75, completed: false, isElective: true },
        ],
      },
    ],
    electives: [
      { code: 'CIS*3490', name: 'Analysis and Design of Computer Algorithms', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*3090', name: 'Digital Systems and Microcontroller Interfacing', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4210', name: 'Machine Learning', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4420', name: 'Real-time Systems Design', credits: 0.75, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4450', name: 'Large-Scale Software Architecture Engineering', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4460', name: 'Robotic Systems', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4490', name: 'Sampled Data Control Design', credits: 0.75, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4540', name: 'Advanced Computer Architecture', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4550', name: 'VLSI Digital Design', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4660', name: 'Medical Image Processing', credits: 0.5, completed: false, category: 'ESC-1' },
      { code: 'ENGG*4390', name: 'Bio-instrumentation Design', credits: 0.75, completed: false, category: 'ESC-1' },
    ],
    electiveCategories: [
      { name: 'ESC-1', title: '2.75 credits from ESC-1 Technical Electives', description: 'Engineering systems and computing technical electives' },
      { name: 'CSE', title: '2.00 credits from Complementary Studies Electives', description: 'Humanities, social sciences, and breadth courses' },
    ],
  },
};

export default function AcademicTreeScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [userMajor, setUserMajor] = useState('Computer Science');
  const [programData, setProgramData] = useState<ProgramRequirements | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [currentCourses, setCurrentCourses] = useState<string[]>([]);
  const [selectedElectives, setSelectedElectives] = useState<{ [key: string]: Course }>({});
  const [showElectiveModal, setShowElectiveModal] = useState(false);
  const [currentElectiveSlot, setCurrentElectiveSlot] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [lastTap, setLastTap] = useState<{ code: string; time: number } | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const preferences = JSON.parse(prefs);
        const major = preferences.major || 'Computer Science';
        setUserMajor(major);

        // Load program data
        const program = PROGRAM_REQUIREMENTS[major] || PROGRAM_REQUIREMENTS['Computer Science'];
        setProgramData(program);

        // Load completed courses
        const savedCompleted = await AsyncStorage.getItem(`completedCourses_${major}`);
        if (savedCompleted) {
          setCompletedCourses(JSON.parse(savedCompleted));
        }

        // Load currently taking courses
        const savedCurrent = await AsyncStorage.getItem(`currentCourses_${major}`);
        if (savedCurrent) {
          setCurrentCourses(JSON.parse(savedCurrent));
        }

        // Load selected electives
        const savedElectives = await AsyncStorage.getItem(`selectedElectives_${major}`);
        if (savedElectives) {
          setSelectedElectives(JSON.parse(savedElectives));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleCourse = async (courseCode: string) => {
    const now = Date.now();
    const isDoubleTap = lastTap && lastTap.code === courseCode && now - lastTap.time < 300;

    if (isDoubleTap) {
      // Double tap = Toggle completed (green)
      let newCompleted: string[];
      let newCurrent: string[];

      if (completedCourses.includes(courseCode)) {
        // Already completed, remove it
        newCompleted = completedCourses.filter(c => c !== courseCode);
        newCurrent = currentCourses;
      } else {
        // Mark as completed, remove from current
        newCompleted = [...completedCourses, courseCode];
        newCurrent = currentCourses.filter(c => c !== courseCode);
      }

      setCompletedCourses(newCompleted);
      setCurrentCourses(newCurrent);
      await AsyncStorage.setItem(`completedCourses_${userMajor}`, JSON.stringify(newCompleted));
      await AsyncStorage.setItem(`currentCourses_${userMajor}`, JSON.stringify(newCurrent));
      setLastTap(null);
    } else {
      // Single tap = Toggle currently taking (blue)
      if (currentCourses.includes(courseCode)) {
        // Remove from current
        const newCurrent = currentCourses.filter(c => c !== courseCode);
        setCurrentCourses(newCurrent);
        await AsyncStorage.setItem(`currentCourses_${userMajor}`, JSON.stringify(newCurrent));
      } else if (!completedCourses.includes(courseCode)) {
        // Add to current (only if not completed)
        const newCurrent = [...currentCourses, courseCode];
        setCurrentCourses(newCurrent);
        await AsyncStorage.setItem(`currentCourses_${userMajor}`, JSON.stringify(newCurrent));
      }
      
      setLastTap({ code: courseCode, time: now });
    }
  };

  const openElectiveModal = (slotCode: string) => {
    setCurrentElectiveSlot(slotCode);
    setShowElectiveModal(true);
  };

  const selectElective = async (elective: Course) => {
    if (!currentElectiveSlot) return;

    const newSelectedElectives = {
      ...selectedElectives,
      [currentElectiveSlot]: elective
    };
    
    setSelectedElectives(newSelectedElectives);
    await AsyncStorage.setItem(`selectedElectives_${userMajor}`, JSON.stringify(newSelectedElectives));
    setShowElectiveModal(false);
    setCurrentElectiveSlot(null);
  };

  const getTotalCompleted = () => {
    if (!programData) return 0;
    let total = 0;
    programData.semesters.forEach(sem => {
      sem.courses.forEach(course => {
        if (completedCourses.includes(course.code)) {
          total += course.credits;
        }
      });
    });
    programData.electives.forEach(course => {
      if (completedCourses.includes(course.code)) {
        total += course.credits;
      }
    });
    return total;
  };

  const getProgress = () => {
    if (!programData) return 0;
    return Math.round((getTotalCompleted() / programData.totalCredits) * 100);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  if (!programData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backArrow, { color: '#007AFF' }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Academic Tree</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.majorText, { color: colors.text }]}>{userMajor}</Text>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              Overall Progress
            </Text>
            <Text style={[styles.progressPercentage, { color: '#667eea' }]}>
              {getProgress()}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: '#667eea', width: `${getProgress()}%` },
              ]}
            />
          </View>
          <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
            {getTotalCompleted().toFixed(1)} / {programData.totalCredits} credits completed
          </Text>
        </View>

        {/* Required Courses by Semester */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Required Courses</Text>

        {programData.semesters.map((semester, index) => (
          <View key={index} style={[styles.semesterCard, { backgroundColor: colors.card }]}>
            <View style={styles.semesterHeader}>
              <Text style={[styles.semesterName, { color: colors.text }]}>{semester.name}</Text>
              <Text style={[styles.semesterProgress, { color: colors.textSecondary }]}>
                {semester.courses.filter(c => completedCourses.includes(c.code)).length} / {semester.courses.length}
              </Text>
            </View>

            {semester.courses.map((course) => {
              // Check if this is an elective slot
              if (course.isElective) {
                const selectedElective = selectedElectives[course.code];
                const displayCourse = selectedElective || course;
                const isCompleted = selectedElective ? completedCourses.includes(selectedElective.code) : false;
                const isCurrent = selectedElective ? currentCourses.includes(selectedElective.code) : false;

                return (
                  <TouchableOpacity
                    key={course.code}
                    style={[
                      styles.courseItem,
                      { borderColor: isDark ? '#2C2C2E' : '#E5E5EA' },
                      isCompleted && { backgroundColor: isDark ? '#1C3B1C' : '#E8F5E9' },
                      isCurrent && !isCompleted && { backgroundColor: isDark ? '#1C2C3B' : '#E8F0F9' },
                      !selectedElective && { borderStyle: 'dashed', borderWidth: 2, borderColor: '#667eea' }
                    ]}
                    onPress={() => {
                      if (selectedElective) {
                        toggleCourse(selectedElective.code);
                      } else {
                        openElectiveModal(course.code);
                      }
                    }}
                    onLongPress={() => {
                      if (selectedElective) {
                        // Allow deleting or changing the elective
                        Alert.alert(
                          'Manage Elective',
                          `What would you like to do with ${selectedElective.code}?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { 
                              text: 'Change', 
                              onPress: () => openElectiveModal(course.code)
                            },
                            { 
                              text: 'Delete', 
                              style: 'destructive',
                              onPress: async () => {
                                // Remove the selected elective
                                const updatedElectives = { ...selectedElectives };
                                delete updatedElectives[course.code];
                                setSelectedElectives(updatedElectives);
                                
                                // Remove from completed courses if it was completed
                                if (completedCourses.includes(selectedElective.code)) {
                                  const updatedCompleted = completedCourses.filter(c => c !== selectedElective.code);
                                  setCompletedCourses(updatedCompleted);
                                  await AsyncStorage.setItem(`completedCourses_${userMajor}`, JSON.stringify(updatedCompleted));
                                }
                                
                                // Save updated electives
                                await AsyncStorage.setItem(`selectedElectives_${userMajor}`, JSON.stringify(updatedElectives));
                              }
                            }
                          ]
                        );
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.courseLeft}>
                      {selectedElective ? (
                        <View style={[
                          styles.checkbox,
                          { borderColor: isCompleted ? '#34C759' : isCurrent ? '#007AFF' : colors.textSecondary },
                          isCompleted && { backgroundColor: '#34C759' },
                          isCurrent && !isCompleted && { backgroundColor: '#007AFF' }
                        ]}>
                          {isCompleted && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                          {isCurrent && !isCompleted && (
                            <Text style={styles.checkmark}>•</Text>
                          )}
                        </View>
                      ) : (
                        <View style={[styles.plusIcon, { borderColor: '#667eea' }]}>
                          <Text style={{ color: '#667eea', fontSize: 18, fontWeight: '700' }}>+</Text>
                        </View>
                      )}
                      <View style={styles.courseInfo}>
                        <Text style={[
                          styles.courseCode,
                          { color: selectedElective ? colors.text : '#667eea' },
                          (isCompleted || isCurrent) && styles.completedText
                        ]}>
                          {selectedElective ? selectedElective.code : 'Select Elective'}
                        </Text>
                        {selectedElective && (
                          <>
                            <Text style={[
                              styles.courseName,
                              { color: colors.textSecondary },
                              (isCompleted || isCurrent) && styles.completedText
                            ]}>
                              {selectedElective.name}
                            </Text>
                            <View style={[styles.electiveBadge, { backgroundColor: isDark ? '#667eea30' : '#667eea20' }]}>
                              <Text style={[styles.electiveBadgeText, { color: '#667eea' }]}>Elective</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.credits, { color: colors.textSecondary }]}>
                      {displayCourse.credits} cr
                    </Text>
                  </TouchableOpacity>
                );
              }

              // Regular course
              const isCompleted = completedCourses.includes(course.code);
              const isCurrent = currentCourses.includes(course.code);
              
              return (
                <TouchableOpacity
                  key={course.code}
                  style={[
                    styles.courseItem,
                    { borderColor: isDark ? '#2C2C2E' : '#E5E5EA' },
                    isCompleted && { backgroundColor: isDark ? '#1C3B1C' : '#E8F5E9' },
                    isCurrent && !isCompleted && { backgroundColor: isDark ? '#1C2C3B' : '#E8F0F9' }
                  ]}
                  onPress={() => toggleCourse(course.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.courseLeft}>
                    <View style={[
                      styles.checkbox,
                      { borderColor: isCompleted ? '#34C759' : isCurrent ? '#007AFF' : colors.textSecondary },
                      isCompleted && { backgroundColor: '#34C759' },
                      isCurrent && !isCompleted && { backgroundColor: '#007AFF' }
                    ]}>
                      {isCompleted && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                      {isCurrent && !isCompleted && (
                        <Text style={styles.checkmark}>•</Text>
                      )}
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={[
                        styles.courseCode,
                        { color: colors.text },
                        (isCompleted || isCurrent) && styles.completedText
                      ]}>
                        {course.code}
                      </Text>
                      <Text style={[
                        styles.courseName,
                        { color: colors.textSecondary },
                        (isCompleted || isCurrent) && styles.completedText
                      ]}>
                        {course.name}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.credits, { color: colors.textSecondary }]}>
                    {course.credits} cr
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Electives */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Available Electives
        </Text>
        
        {programData.electiveCategories && programData.electiveCategories.length > 0 ? (
          // Display electives organized by categories
          programData.electiveCategories.map((category) => {
            const categoryElectives = programData.electives.filter(
              (course) => course.category === category.name
            );
            
            if (categoryElectives.length === 0) return null;
            
            const isExpanded = expandedCategories[category.name];
            
            return (
              <View key={category.name} style={{ marginBottom: 16 }}>
                <TouchableOpacity
                  style={[styles.semesterCard, { backgroundColor: colors.card }]}
                  onPress={() => toggleCategory(category.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.semesterHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.semesterName, { color: colors.text }]}>
                        {category.title}
                      </Text>
                      <Text style={[styles.electivesNote, { color: colors.textSecondary, marginTop: 4 }]}>
                        {category.description}
                      </Text>
                    </View>
                    <Text style={[styles.expandIcon, { color: colors.textSecondary }]}>
                      {isExpanded ? '▼' : '▶'}
                    </Text>
                  </View>

                  {isExpanded && categoryElectives.map((course) => (
                    <View
                      key={course.code}
                      style={[
                        styles.courseItem,
                        { borderColor: isDark ? '#2C2C2E' : '#E5E5EA' }
                      ]}
                    >
                      <View style={styles.courseLeft}>
                        <View style={styles.courseInfo}>
                          <Text style={[styles.courseCode, { color: colors.text }]}>
                            {course.code}
                          </Text>
                          <Text style={[styles.courseName, { color: colors.textSecondary }]}>
                            {course.name}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.credits, { color: colors.textSecondary }]}>
                        {course.credits} cr
                      </Text>
                    </View>
                  ))}
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          // Fallback: Display all electives in one section
          <View style={[styles.semesterCard, { backgroundColor: colors.card }]}>
            <View style={styles.semesterHeader}>
              <Text style={[styles.electivesNote, { color: colors.textSecondary }]}>
                These are the electives available for your program
              </Text>
            </View>

            {programData.electives.map((course) => (
              <View
                key={course.code}
                style={[
                  styles.courseItem,
                  { borderColor: isDark ? '#2C2C2E' : '#E5E5EA' }
                ]}
              >
                <View style={styles.courseLeft}>
                  <View style={styles.courseInfo}>
                    <Text style={[styles.courseCode, { color: colors.text }]}>
                      {course.code}
                    </Text>
                    <Text style={[styles.courseName, { color: colors.textSecondary }]}>
                      {course.name}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.credits, { color: colors.textSecondary }]}>
                  {course.credits} cr
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Celebration Message */}
        {getProgress() === 100 && (
          <View style={[styles.celebrationCard, { backgroundColor: '#667eea' + '20' }]}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={[styles.celebrationText, { color: '#667eea' }]}>
              Congratulations! You've completed all requirements!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Elective Selection Modal */}
      <Modal
        visible={showElectiveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowElectiveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Elective</Text>
              <TouchableOpacity onPress={() => setShowElectiveModal(false)}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {programData?.electiveCategories && programData.electiveCategories.length > 0 ? (
                // Display electives organized by categories
                programData.electiveCategories.map((category, index) => {
                  const categoryElectives = programData.electives.filter(
                    (elective) => elective.category === category.name
                  );
                  
                  if (categoryElectives.length === 0) return null;
                  
                  return (
                    <View key={category.name} style={styles.modalCategory}>
                      {/* Category Header */}
                      <View style={styles.modalCategoryHeader}>
                        <Text style={[styles.modalCategoryTitle, { color: colors.text }]}>
                          {category.title}
                        </Text>
                        <Text style={[styles.modalCategoryDesc, { color: colors.textSecondary }]}>
                          {category.description}
                        </Text>
                      </View>

                      {/* Category Electives */}
                      {categoryElectives.map((elective) => (
                        <TouchableOpacity
                          key={elective.code}
                          style={[
                            styles.electiveOption,
                            { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
                          ]}
                          onPress={() => selectElective(elective)}
                        >
                          <View style={styles.electiveInfo}>
                            <Text style={[styles.electiveCode, { color: colors.text }]}>
                              {elective.code}
                            </Text>
                            <Text style={[styles.electiveName, { color: colors.textSecondary }]}>
                              {elective.name}
                            </Text>
                          </View>
                          <Text style={[styles.electiveCredits, { color: colors.textSecondary }]}>
                            {elective.credits} cr
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })
              ) : (
                // Fallback: Display all electives without categories
                programData?.electives
                  .filter(elective => !elective.code.includes('COMPLEMENTARY') && !elective.code.includes('RESTRICTED'))
                  .map((elective) => (
                    <TouchableOpacity
                      key={elective.code}
                      style={[
                        styles.electiveOption,
                        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
                      ]}
                      onPress={() => selectElective(elective)}
                    >
                      <View style={styles.electiveInfo}>
                        <Text style={[styles.electiveCode, { color: colors.text }]}>
                          {elective.code}
                        </Text>
                        <Text style={[styles.electiveName, { color: colors.textSecondary }]}>
                          {elective.name}
                        </Text>
                      </View>
                      <Text style={[styles.electiveCredits, { color: colors.textSecondary }]}>
                        {elective.credits} cr
                      </Text>
                    </TouchableOpacity>
                  ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  progressCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  majorText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  creditsText: {
    fontSize: 13,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  semesterCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  semesterHeader: {
    marginBottom: 16,
  },
  semesterName: {
    fontSize: 18,
    fontWeight: '700',
  },
  semesterProgress: {
    fontSize: 14,
    marginTop: 4,
  },
  electivesNote: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  courseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseName: {
    fontSize: 13,
  },
  completedText: {
    opacity: 0.6,
  },
  credits: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  celebrationCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  celebrationText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  plusIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 28,
    fontWeight: '300',
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  modalCategory: {
    marginBottom: 24,
  },
  modalCategoryHeader: {
    marginBottom: 12,
  },
  modalCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalCategoryDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  electiveOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  electiveInfo: {
    flex: 1,
  },
  electiveCode: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  electiveName: {
    fontSize: 13,
  },
  electiveCredits: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  electiveBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  electiveBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    marginLeft: 12,
  },
});
