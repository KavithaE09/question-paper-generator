-- Question Paper Generation System Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS question_paper_db;
USE question_paper_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  department_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Questions Table with TOPIC column
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(50) NOT NULL,
  unit INT NOT NULL,
  marks INT NOT NULL,
  question_text TEXT NOT NULL,
  bloom VARCHAR(10) NOT NULL,
  course_outcome VARCHAR(10) NOT NULL,
  program_outcome VARCHAR(20) NOT NULL,
  has_diagram BOOLEAN DEFAULT FALSE,
  topic VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course_code (course_code),
  INDEX idx_unit (unit),
  INDEX idx_marks (marks),
  INDEX idx_topic (topic)
);

-- Question Papers Table
CREATE TABLE IF NOT EXISTS question_papers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department VARCHAR(255) NOT NULL,
  course_code VARCHAR(50) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  year VARCHAR(50) NOT NULL,
  regulation VARCHAR(50) NOT NULL,
  exam_type VARCHAR(50) NOT NULL,
  exam_date DATE NOT NULL,
  register_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Question Paper Questions
CREATE TABLE IF NOT EXISTS question_paper_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paper_id INT NOT NULL,
  question_id INT NOT NULL,
  question_number VARCHAR(10) NOT NULL,
  part VARCHAR(5) NOT NULL,
  FOREIGN KEY (paper_id) REFERENCES question_papers(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Departments
INSERT INTO departments (name, code) VALUES
('Computer Science and Engineering', 'CSE'),
('Electronics and Communication Engineering', 'ECE'),
('Electrical and Electronics Engineering', 'EEE'),
('Mechanical Engineering', 'MECH'),
('Civil Engineering', 'CIVIL'),
('Information Technology', 'IT')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Sample Courses
INSERT INTO courses (name, code, department_id) VALUES
('Artificial Intelligence', '21CS6004', 1),
('Data Structures', '21CS3001', 1),
('Database Management Systems', '21CS4002', 1),
('Computer Networks', '21CS5003', 1),
('Operating Systems', '21CS4004', 1),
('Digital Signal Processing', '21EC5001', 2),
('VLSI Design', '21EC6002', 2),
('Microprocessors', '21EC4003', 2),
('Digital Principles and System Design', '24IT3501', 6)
ON DUPLICATE KEY UPDATE name=name;

ALTER TABLE question_papers 
ADD COLUMN status ENUM('draft', 'completed') DEFAULT 'draft',
ADD COLUMN last_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN selected_questions JSON DEFAULT NULL;


ALTER TABLE question_papers 
MODIFY COLUMN exam_date DATE NULL DEFAULT NULL;
-- =====================================================
-- UNIT 1: BOOLEAN ALGEBRA AND LOGIC GATES
-- =====================================================

-- PART A (10 questions - 2 marks each)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 1, 2, 'Find the result using 1''s complement method (any one can be asked) i. 47-25 ii. -43+27 iii. -37-21', 'K1', 'CO1', 'PO1', 0, 'T1'),
('24IT3501', 1, 2, 'Find the result using 2''s complement method (any one can be asked) i. 38-24 ii. -23+17 iii. -42-26', 'K1', 'CO1', 'PO1', 0, 'T1'),
('24IT3501', 1, 2, 'Consider a System S as shown in figure. If the input applied is a) 101101 b) 110101 What is the output of the following two inputs into the system S?', 'K1', 'CO1', 'PO1', 1, 'T1'),
('24IT3501', 1, 2, 'Prove that (i) [(X + Y)'' + (X + Y)'']'' = X + Y (ii) A''B + AB + A''B'' = A'' + B', 'K1', 'CO1', 'PO1', 0, 'T2'),
('24IT3501', 1, 2, 'Simplify (i) (AB + C)(B''D + C''E'') + (AB + C)'' (ii) (X(Y'' + Z''))''', 'K1', 'CO1', 'PO1', 0, 'T2'),
('24IT3501', 1, 2, 'Find dual of the following Boolean expression XYZ'' + X''YZ + Z(XY + W)', 'K1', 'CO1', 'PO1', 0, 'T2'),
('24IT3501', 1, 2, 'Express the following function in sum of min-terms: F(X,Y,Z) = X + YZ', 'K1', 'CO1', 'PO1', 0, 'T3'),
('24IT3501', 1, 2, 'Express the following function in product of max-terms: F(X,Y,Z) = (X'' + Y)(Y + Z'')', 'K1', 'CO1', 'PO1', 0, 'T3'),
('24IT3501', 1, 2, 'Simplify the following Boolean function by using K-map F = sum(0, 1, 2, 6)', 'K1', 'CO1', 'PO1', 0, 'T4'),
('24IT3501', 1, 2, 'Realize XOR gate using only NAND gates', 'K1', 'CO1', 'PO1', 0, 'T5');

-- PART B (8 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 1, 13, 'System S performs 1''s Complement of I/P and 2''s Complement to produce O/P. A new system H is designed in which 3 systems S are cascaded. a) If input applied is 101011, What will be the output equal to? b) If input applied is 111001, What will be the output equal to?', 'K1', 'CO1', 'PO1', 1, 'T1'),
('24IT3501', 1, 13, 'Match List-I with List-II and select the correct answer using the codes given below for Boolean expressions simplification', 'K2', 'CO1', 'PO1', 0, 'T2'),
('24IT3501', 1, 13, 'Match List-I with List-II and select the correct answer using the Canonical SOP form of the LHS to the RHS given', 'K3', 'CO1', 'PO1', 0, 'T3'),
('24IT3501', 1, 13, 'Match List-I with List-II and select the correct answer using the Canonical POS form of the LHS to the RHS given', 'K3', 'CO1', 'PO1', 0, 'T3'),
('24IT3501', 1, 6, 'Simplify the Boolean function F(A,B,C,D) = sum(1, 3, 4, 6, 9, 11, 12, 14)', 'K4', 'CO1', 'PO1', 0, 'T4'),
('24IT3501', 1, 7, 'Simplify the following Boolean function by using K-map F = product(3, 6, 7, 8, 10, 11, 12, 13)', 'K4', 'CO1', 'PO1', 0, 'T4'),
('24IT3501', 1, 13, 'Simplify the Boolean function F(A,B,C,D) = sum(2, 4, 5, 10) + sum d(0, 6, 8, 9, 11, 12, 13, 14) and implement the function i. using AND-OR gates ii. using NAND gates only', 'K4', 'CO1', 'PO1', 0, 'T4'),
('24IT3501', 1, 13, 'Simplify the Boolean function by using K-map F = product(2, 3, 4, 6, 8, 11, 14, 15) + product d(5, 7, 9) and implement i. using OR-AND gates only ii. using NOR gates only', 'K4', 'CO1', 'PO1', 0, 'T4');

-- PART C (2 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 1, 15, 'Design a digital circuit for a home security system with four sensors: Motion Sensor (A), Door Sensor (B), Window Sensor (C), Glass Break Sensor (D). The system triggers alarm (F=1) when: i. Motion detected and no doors/windows open ii. Any door or window opened iii. Glass break with any other sensor. Task: a) Construct truth table b) Simplify using K-map c) Implement using AND-OR gates d) Implement using NAND gates only', 'K1', 'CO1', 'PO1', 0, 'T4'),
('24IT3501', 1, 15, 'Design a security system circuit monitoring three sensors: motion detector (A), door sensor (B), window sensor (C). Alarm (Y) activates when: i. Motion triggered and either door or window triggered ii. Motion not triggered but both door and window triggered. Identify conditions, write truth table, and determine minterm expression', 'K3', 'CO1', 'PO1', 0, 'T3');

-- =====================================================
-- UNIT 2: COMBINATIONAL LOGIC
-- =====================================================

-- PART A (10 questions - 2 marks each)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 2, 2, 'In Carry Look Ahead adder what is the Generalized function (Gi) and Propagation function (Pi)?', 'K1', 'CO2', 'PO1', 0, 'T1'),
('24IT3501', 2, 2, 'Convert binary number into Gray code: 100101. Convert Gray code number into Binary Number: 110101', 'K1', 'CO2', 'PO1', 0, 'T2'),
('24IT3501', 2, 2, 'The given logic circuit represents code converter circuit. Identify the type.', 'K2', 'CO2', 'PO1', 1, 'T2'),
('24IT3501', 2, 2, 'Convert BCD number into Excess-3 code: 1001, 0101. Convert Excess code number into Binary Number: 110101', 'K1', 'CO2', 'PO1', 0, 'T2'),
('24IT3501', 2, 2, 'Implement the function G = sum(0,3) using a 2x4 decoder', 'K1', 'CO2', 'PO1', 0, 'T3'),
('24IT3501', 2, 2, 'In the following circuit, three functions F1, F2, F3 are formed with the combinations of the outputs of a 3 to 8 decoder. Identify the functions', 'K2', 'CO2', 'PO1', 1, 'T3'),
('24IT3501', 2, 2, 'In a Multiplexer if there are 8 input lines and one output line, how many select lines will be there?', 'K1', 'CO2', 'PO1', 0, 'T4'),
('24IT3501', 2, 2, 'The logic function realized by the given multiplexer circuit is', 'K2', 'CO2', 'PO1', 1, 'T4'),
('24IT3501', 2, 2, 'Can error be detected by Parity Checker? If so, how many errors? What type of parity generator does the circuit represent?', 'K1', 'CO2', 'PO1', 1, 'T5'),
('24IT3501', 2, 2, 'Determine the HDL description for the given circuit', 'K1', 'CO2', 'PO1', 1, 'T6');

-- PART B (8 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 2, 4, 'The logic circuit adds two digits in Excess-3 code. Correction required after adding: If C0=1, add 3; If C0=0, subtract 3. Identify inputs to 2nd 4-bit full adder in terms of C0', 'K1', 'CO2', 'PO1', 1, 'T1'),
('24IT3501', 2, 9, 'Design a high-performance computer system for 64-bit arithmetic operations. Decide which adder to use in ALU and explain its advantage over Ripple Carry Adder', 'K2', 'CO2', 'PO1', 0, 'T1'),
('24IT3501', 2, 13, 'Design a digital communication system using Gray code to minimize transmission errors. Design and implement a 4-bit Binary to Gray Code converter', 'K2', 'CO2', 'PO1', 0, 'T2'),
('24IT3501', 2, 13, 'Develop a digital clock display system using BCD. Design and implement a 4-bit BCD to Excess-3 Code converter for error detection', 'K3', 'CO2', 'PO1', 0, 'T2'),
('24IT3501', 2, 13, 'Develop an automated inventory system using Excess-3 code. Design and implement Excess-3 to 4-bit BCD converter for reporting and system integration', 'K3', 'CO2', 'PO1', 0, 'T2'),
('24IT3501', 2, 7, 'How many 3-to-8 line decoders with enable input are needed to construct a 4-to-16 line decoder without any other logic gates?', 'K3', 'CO2', 'PO1', 0, 'T3'),
('24IT3501', 2, 6, 'Implement the following switching functions using decoder and OR gates: F1 = sum m(1,2,4,8,10,14), F2 = sum m(2,5,9,11), F3 = sum m(2,4,5,6,7)', 'K3', 'CO2', 'PO1', 0, 'T3'),
('24IT3501', 2, 5, 'Identify the logic function realized by the given multiplexer circuit', 'K4', 'CO2', 'PO1', 1, 'T4');

-- PART C (2 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 2, 5, 'A Boolean circuit using two 4-input multiplexers (M1, M2) and one 2-input multiplexer (M3). X0-X7 are inputs. Select lines connected to A, B, C. Realize the Boolean Function', 'K2', 'CO2', 'PO1', 1, 'T4'),
('24IT3501', 2, 15, 'Design a robust digital storage system storing data in Gray code format. Design and implement 4-bit Gray to Binary Code converter for data retrieval and processing', 'K2', 'CO2', 'PO1', 0, 'T2');

-- =====================================================
-- UNIT 3: SYNCHRONOUS SEQUENTIAL LOGIC
-- =====================================================

-- PART A (8 questions - 2 marks each)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 3, 2, 'Differentiate between latch and flip-flop', 'K1', 'CO3', 'PO1', 0, 'T1'),
('24IT3501', 3, 2, 'If J=0, K=0 and Present state Q(t)=1, then what is the next state of JK FF?', 'K1', 'CO3', 'PO1', 0, 'T1'),
('24IT3501', 3, 2, 'List the steps in the Analysis of a Synchronous Sequential Circuit', 'K1', 'CO3', 'PO1', 0, 'T2'),
('24IT3501', 3, 2, 'Write the excitation table for the four flip-flops', 'K1', 'CO3', 'PO1', 0, 'T3'),
('24IT3501', 3, 2, 'What is State Reduction? State why states have to be reduced', 'K1', 'CO3', 'PO1', 0, 'T4'),
('24IT3501', 3, 2, 'List out the applications of shift registers', 'K1', 'CO3', 'PO1', 0, 'T5'),
('24IT3501', 3, 2, 'Draw the state diagram of Mod-10 counter', 'K1', 'CO3', 'PO1', 0, 'T6'),
('24IT3501', 3, 2, 'How many flip-flops are required to build a binary counter that counts from 0 to 1023?', 'K1', 'CO3', 'PO1', 0, 'T6');

-- PART B (8 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 3, 13, 'Design a digital stopwatch using 2-bit binary counter with D flip-flops. Analyze behavior for first four clock pulses. Initial state A=0, B=0', 'K2', 'CO3', 'PO1', 1, 'T2'),
('24IT3501', 3, 13, 'Design a digital stopwatch using 2-bit binary counter with JK flip-flops. Analyze behavior for first four clock pulses. Initial state A=0, B=0', 'K2', 'CO3', 'PO1', 1, 'T2'),
('24IT3501', 3, 6, 'Design sequence generator for binary counter using T flip-flops. Explain logic and connections to convert T flip-flop into JK flip-flop', 'K3', 'CO3', 'PO1', 0, 'T3'),
('24IT3501', 3, 7, 'Design digital system requiring D flip-flops but only JK flip-flops available. Convert JK flip-flops into D flip-flops', 'K3', 'CO3', 'PO1', 0, 'T3'),
('24IT3501', 3, 13, 'Reduce the number of states in the given state diagram. Tabulate reduced state table and draw reduced state diagram', 'K4', 'CO3', 'PO1', 1, 'T4'),
('24IT3501', 3, 13, 'Design data acquisition system for scientific experiment. Explain different types of shift registers: SISO, SIPO, PISO, PIPO with diagrams', 'K3', 'CO3', 'PO1', 0, 'T5'),
('24IT3501', 3, 13, 'Develop digital control system for industrial machinery. Design counter for sequence: 000, 111, 101, 100, 011, 010, 001 using D flip-flops', 'K3', 'CO3', 'PO1', 0, 'T6'),
('24IT3501', 3, 13, 'Design state machine for robotics project. Sketch circuit diagrams for ring counter and twisted ring counter (Johnson counter)', 'K3', 'CO3', 'PO1', 0, 'T6');

-- PART C (2 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 3, 15, 'Design digital security system with unique access pattern. Sequence: 0,4,7,2,3,5. Design synchronous counter using T Flip-Flops for this sequence', 'K4', 'CO3', 'PO1', 0, 'T6'),
('24IT3501', 3, 15, 'Draw initial State Diagram, reduce the given state table, tabulate reduced state table and draw reduced state diagram', 'K4', 'CO3', 'PO1', 0, 'T4');

-- =====================================================
-- UNIT 4: ASYNCHRONOUS SEQUENTIAL LOGIC
-- =====================================================

-- PART A (8 questions - 2 marks each)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 4, 2, 'Design a control system for traffic light responding to sensor inputs without clock signal. What type of sequential circuit is most suitable?', 'K1', 'CO4', 'PO1', 0, 'T1'),
('24IT3501', 4, 2, 'In a digital circuit, if output remains constant despite brief input glitch, what state is the circuit in? Provide contrasting example', 'K1', 'CO4', 'PO1', 0, 'T1'),
('24IT3501', 4, 2, 'During asynchronous circuit design, you create a table mapping current states, inputs, and next states. What is this table called? Give example', 'K2', 'CO4', 'PO1', 0, 'T2'),
('24IT3501', 4, 2, 'You simplify a flow table to only include essential information for each state transition. What is this simplified version called? Give example', 'K3', 'CO4', 'PO1', 0, 'T3'),
('24IT3501', 4, 2, 'In asynchronous circuit design, why is it critical to ensure state transitions do not lead to unintended intermediate states? State one example', 'K4', 'CO4', 'PO1', 0, 'T4'),
('24IT3501', 4, 2, 'What problem arises when two or more state transitions occur simultaneously due to multiple input changes? State the two types with example', 'K4', 'CO4', 'PO1', 0, 'T4'),
('24IT3501', 4, 2, 'While testing digital circuit, you notice glitches when inputs change slowly. What type of hazard is this and how can it be eliminated?', 'K5', 'CO4', 'PO1', 0, 'T5'),
('24IT3501', 4, 2, 'In sequential circuit, you observe timing issues related to delays in feedback path. What is this hazard and how to address it?', 'K5', 'CO4', 'PO1', 0, 'T5');

-- PART B (8 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 4, 13, 'Analyze the given circuit and determine whether the circuit is stable or not', 'K1', 'CO4', 'PO1', 1, 'T1'),
('24IT3501', 4, 13, 'Analyze the given asynchronous sequential circuit and determine stability', 'K1', 'CO4', 'PO1', 1, 'T1'),
('24IT3501', 4, 13, 'Design asynchronous sequential circuit with two inputs X1, X2 and output Z. Initially X1=X2=0. When X1 or X2 becomes 1, Z=1. When second input becomes 1, Z=0. Use SR Latch', 'K2', 'CO4', 'PO1', 0, 'T2'),
('24IT3501', 4, 13, 'Design circuit with primary inputs A and B to give output Z=1 when A becomes 1 if B is already 1. Once Z=1, it remains until A goes to 0. Use S-R Latch', 'K2', 'CO4', 'PO1', 0, 'T2'),
('24IT3501', 4, 13, 'Design asynchronous sequential circuit with inputs X, Y and output Z. When Y=1, input X transfers to Z. When Y=0, output does not change', 'K4', 'CO4', 'PO1', 0, 'T2'),
('24IT3501', 4, 13, 'Explain critical races and non-critical races in asynchronous sequential circuits. Describe how to identify and resolve with examples', 'K4', 'CO4', 'PO1', 0, 'T4'),
('24IT3501', 4, 7, 'Write a detailed note on different types of hazards and how to eliminate Hazards', 'K5', 'CO4', 'PO1', 0, 'T5'),
('24IT3501', 4, 6, 'Realize hazard free realization for switching function F(A,B,C,D) = sum m(0,2,6,7,8,10,12)', 'K5', 'CO4', 'PO1', 0, 'T5');

-- PART C (2 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 4, 15, 'Design a gated latch circuit with inputs G (gate) and D (data), and output Q. Binary information at D transfers to Q when G=1. Q follows D as long as G=1. When G goes to 0, information is retained', 'K2', 'CO4', 'PO1', 0, 'T2'),
('24IT3501', 4, 7, 'Realize hazard free realization for switching function F(A,B,C,D) = sum m(1,3,5,7,8,9,14,15)', 'K5', 'CO4', 'PO1', 0, 'T5');

-- =====================================================
-- UNIT 5: MEMORY AND PROGRAMMABLE LOGIC
-- =====================================================

-- PART A (8 questions - 2 marks each)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 5, 2, 'What is dynamic RAM cell? Draw its basic structure', 'K1', 'CO5', 'PO1', 0, 'T1'),
('24IT3501', 5, 2, 'What is Memory Refreshing?', 'K1', 'CO5', 'PO1', 0, 'T1'),
('24IT3501', 5, 2, 'Enhance data reliability in communication system. How to implement scheme to detect double errors and correct single errors?', 'K1', 'CO5', 'PO1', 0, 'T2'),
('24IT3501', 5, 2, 'Develop circuit requiring programmable memory for storage and logic functions. What are key differences between EPROM and PLA?', 'K1', 'CO5', 'PO1', 0, 'T3'),
('24IT3501', 5, 2, 'For high-capacity storage device, you opt for 8K x 8 ROM. How many address lines and data lines required?', 'K1', 'CO5', 'PO1', 0, 'T3'),
('24IT3501', 5, 2, 'Integrate the realization of Ex-OR function into the PROM', 'K1', 'CO5', 'PO1', 0, 'T3'),
('24IT3501', 5, 2, 'How programmable logic devices are classified?', 'K1', 'CO5', 'PO1', 0, 'T4'),
('24IT3501', 5, 2, 'Choose between PAL and PLA for combinational logic circuits. Justify choice if you need flexible and easily modifiable logic configurations', 'K1', 'CO5', 'PO1', 0, 'T5');

-- PART B (8 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 5, 13, 'Differentiate static and dynamic RAM. Draw circuits of one cell of each and explain working principle. Explain Read and Write operations in RAM', 'K1', 'CO5', 'PO1', 0, 'T1'),
('24IT3501', 5, 13, 'Messages coded in even parity Hamming code transmitted through noisy channel. Decode: (i) 1001001 (ii) 0111001 (iii) 1110110 (iv) 0011011', 'K2', 'CO5', 'PO1', 0, 'T2'),
('24IT3501', 5, 7, 'Explain combinational circuit using ROM accepting 3-bit binary number and outputting binary number equal to square of input', 'K3', 'CO5', 'PO1', 0, 'T3'),
('24IT3501', 5, 6, 'Implement using PROM: F1 = sum m(0,1,3,5,7,9), F2 = sum m(1,2,4,7,8,10,11), F3 = sum m(2,4,9,10,11,14,15)', 'K3', 'CO5', 'PO1', 0, 'T3'),
('24IT3501', 5, 13, 'Implement using PLA: F1(A,B,C) = AB'' + AC + A''BC'', F2(A,B,C) = (AC + BC)''', 'K3', 'CO5', 'PO1', 0, 'T4'),
('24IT3501', 5, 13, 'Implement using PLA: A(x,y,z) = sum m(1,2,4,6), B(x,y,z) = sum m(0,1,6,7), C(x,y,z) = sum m(2,6)', 'K3', 'CO5', 'PO1', 0, 'T4'),
('24IT3501', 5, 13, 'Implement using PAL: A(x,y,z) = sum m(1,2,4,6), B(x,y,z) = sum m(0,1,6,7), C(x,y,z) = sum m(1,2,3,5,7)', 'K3', 'CO5', 'PO1', 0, 'T5'),
('24IT3501', 5, 13, 'Implement switching function using PAL: w(A,B,C,D) = sum m(0,2,6,7,8,9,12,13), x(A,B,C,D) = sum m(0,2,6,7,8,9,12,13,14), y(A,B,C,D) = sum m(2,3,8,9,10,12,13), z(A,B,C,D) = sum m(1,3,4,6,9,12,14)', 'K3', 'CO5', 'PO1', 0, 'T5');

-- PART C (2 questions)
INSERT INTO questions (course_code, unit, marks, question_text, bloom, course_outcome, program_outcome, has_diagram, topic) VALUES
('24IT3501', 5, 8, 'Implement Boolean functions using PLA with 3 inputs, 6 product terms and 3 outputs: F1 = sum m(3,5,6,7), F2 = sum m(1,2,3,4), F3 = sum m(1,3,4,6)', 'K3', 'CO5', 'PO1', 0, 'T4'),
('24IT3501', 5, 8, 'Messages coded in odd parity Hamming code transmitted through noisy channel. Decode: (v) 1011001 (vi) 0111011 (vii) 1100110 (viii) 0010011', 'K2', 'CO5', 'PO1', 0, 'T2');

-- Verify the data
SELECT unit, topic, COUNT(*) as question_count, 
       SUM(CASE WHEN marks = 2 THEN 1 ELSE 0 END) as part_a,
       SUM(CASE WHEN marks BETWEEN 3 AND 13 THEN 1 ELSE 0 END) as part_b,
       SUM(CASE WHEN marks >= 15 THEN 1 ELSE 0 END) as part_c
FROM questions 
WHERE course_code = '24IT3501' 
GROUP BY unit, topic 
ORDER BY unit, topic;