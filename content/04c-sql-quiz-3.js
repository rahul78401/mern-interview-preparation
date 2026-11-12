/* SQL Quiz 3: Practice Lab. 50 tasks, from basic SELECT up to CTEs and window functions, on its own tables
   (Departments, Employees, Projects, Assignments). GENERATED data: every expected output was produced by running
   the solution on the setup below. The learner writes SQL in the compiler, then compares with the expected output. */
(() => {
  const Q = Learn.quizKit;
  if (!Q) return;
  const { t, tv, buildPage, addQuiz } = Q;

  const SETUP = `DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Departments;

CREATE TABLE Departments (
  dept_id   INT PRIMARY KEY,
  dept_name VARCHAR(50),
  location  VARCHAR(50)
);
CREATE TABLE Employees (
  emp_id     INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name  VARCHAR(50),
  dept_id    INT,
  manager_id INT,
  salary     INT,
  hire_date  DATE,
  email      VARCHAR(100)
);
CREATE TABLE Projects (
  project_id   INT PRIMARY KEY,
  project_name VARCHAR(100),
  dept_id      INT,
  budget       INT,
  status       VARCHAR(20)
);
CREATE TABLE Assignments (
  emp_id     INT,
  project_id INT,
  hours      INT,
  PRIMARY KEY (emp_id, project_id)
);

INSERT INTO Departments VALUES
  (1, 'Engineering', 'Bangalore'),
  (2, 'Sales',       'Mumbai'),
  (3, 'HR',          'Delhi'),
  (4, 'Finance',     'Mumbai'),
  (5, 'Legal',       'Chennai');
INSERT INTO Employees VALUES
  (1,  'Asha',   'Rao',    1,    NULL, 95000, '2019-03-15', 'asha.rao@corp.com'),
  (2,  'Ravi',   'Kumar',  1,    1,    72000, '2020-07-01', 'ravi.kumar@corp.com'),
  (3,  'Meera',  'Shah',   1,    1,    72000, '2021-01-10', NULL),
  (4,  'Karan',  'Mehta',  2,    1,    58000, '2018-11-23', 'karan.m@gmail.com'),
  (5,  'Priya',  'Nair',   2,    4,    61000, '2022-05-02', 'priya.nair@corp.com'),
  (6,  'Sunil',  'Verma',  3,    1,    48000, '2017-08-14', NULL),
  (7,  'Neha',   'Gupta',  4,    1,    67000, '2020-02-20', 'neha.gupta@corp.com'),
  (8,  'Arjun',  'Singh',  4,    7,    52000, '2023-09-05', 'arjun.s@gmail.com'),
  (9,  'Divya',  'Iyer',   NULL, 1,    45000, '2023-01-30', 'divya.iyer@corp.com'),
  (10, 'Rahul',  'Das',    1,    2,    55000, '2024-04-18', 'rahul.das@corp.com');
INSERT INTO Projects VALUES
  (1, 'Website Revamp',  1, 500000, 'Active'),
  (2, 'Mobile App',      1, 800000, 'Active'),
  (3, 'Sales Portal',    2, 300000, 'Completed'),
  (4, 'Payroll Upgrade', 4, 250000, 'Active'),
  (5, 'Hiring Drive',    3, 120000, 'On Hold'),
  (6, 'Cost Audit',      4,  90000, 'Completed'),
  (7, 'Brand Campaign',  2, 400000, 'On Hold'),
  (8, 'Data Lake',       1, 950000, 'Active');
INSERT INTO Assignments VALUES
  (1,  1, 120),
  (1,  2,  80),
  (2,  1, 200),
  (2,  2, 150),
  (2,  8, 100),
  (3,  2, 170),
  (3,  8,  75),
  (4,  3,  90),
  (5,  3, 110),
  (7,  4, 140),
  (8,  4, 160),
  (10, 1,  60);`;

  const band = 
    tv('Departments', ['dept_id', 'dept_name', 'location'], [['1', 'Engineering', 'Bangalore'], ['2', 'Sales', 'Mumbai'], ['3', 'HR', 'Delhi'], ['4', 'Finance', 'Mumbai'], ['5', 'Legal', 'Chennai']]) +
    tv('Employees', ['emp_id', 'first_name', 'last_name', 'dept_id', 'manager_id', 'salary', 'hire_date', 'email'], [['1', 'Asha', 'Rao', '1', 'NULL', '95000', '2019-03-15', 'asha.rao@corp.com'], ['2', 'Ravi', 'Kumar', '1', '1', '72000', '2020-07-01', 'ravi.kumar@corp.com'], ['3', 'Meera', 'Shah', '1', '1', '72000', '2021-01-10', 'NULL'], ['4', 'Karan', 'Mehta', '2', '1', '58000', '2018-11-23', 'karan.m@gmail.com'], ['5', 'Priya', 'Nair', '2', '4', '61000', '2022-05-02', 'priya.nair@corp.com'], ['6', 'Sunil', 'Verma', '3', '1', '48000', '2017-08-14', 'NULL'], ['7', 'Neha', 'Gupta', '4', '1', '67000', '2020-02-20', 'neha.gupta@corp.com'], ['8', 'Arjun', 'Singh', '4', '7', '52000', '2023-09-05', 'arjun.s@gmail.com'], ['9', 'Divya', 'Iyer', 'NULL', '1', '45000', '2023-01-30', 'divya.iyer@corp.com'], ['10', 'Rahul', 'Das', '1', '2', '55000', '2024-04-18', 'rahul.das@corp.com']]) +
    tv('Projects', ['project_id', 'project_name', 'dept_id', 'budget', 'status'], [['1', 'Website Revamp', '1', '500000', 'Active'], ['2', 'Mobile App', '1', '800000', 'Active'], ['3', 'Sales Portal', '2', '300000', 'Completed'], ['4', 'Payroll Upgrade', '4', '250000', 'Active'], ['5', 'Hiring Drive', '3', '120000', 'On Hold'], ['6', 'Cost Audit', '4', '90000', 'Completed'], ['7', 'Brand Campaign', '2', '400000', 'On Hold'], ['8', 'Data Lake', '1', '950000', 'Active']]) +
    tv('Assignments', ['emp_id', 'project_id', 'hours'], [['1', '1', '120'], ['1', '2', '80'], ['2', '1', '200'], ['2', '2', '150'], ['2', '8', '100'], ['3', '2', '170'], ['3', '8', '75'], ['4', '3', '90'], ['5', '3', '110'], ['7', '4', '140'], ['8', '4', '160'], ['10', '1', '60']]);;

  const groups = [
    {
      chip: 'SELECT · WHERE · ORDER BY', title: 'SELECT, WHERE, ORDER BY, LIMIT', sub: 'Pick columns, filter rows, sort and cut the result.',
      qs: [
        { tag: 'SELECT', task: 'Show <strong>every column and every row</strong> of the Departments table.',
          sql: `SELECT *
FROM Departments;`, result: t(['dept_id', 'dept_name', 'location'], ['1', 'Engineering', 'Bangalore'], ['2', 'Sales', 'Mumbai'], ['3', 'HR', 'Delhi'], ['4', 'Finance', 'Mumbai'], ['5', 'Legal', 'Chennai']),
          hints: ['The star (*) means all columns.', 'You only need SELECT and FROM.'] },
        { tag: 'SELECT columns', task: 'Show the <strong>first_name</strong>, <strong>last_name</strong> and <strong>salary</strong> of every employee, in emp_id order.',
          sql: `SELECT first_name, last_name, salary
FROM Employees
ORDER BY emp_id;`, result: t(['first_name', 'last_name', 'salary'], ['Asha', 'Rao', '95000'], ['Ravi', 'Kumar', '72000'], ['Meera', 'Shah', '72000'], ['Karan', 'Mehta', '58000'], ['Priya', 'Nair', '61000'], ['Sunil', 'Verma', '48000'], ['Neha', 'Gupta', '67000'], ['Arjun', 'Singh', '52000'], ['Divya', 'Iyer', '45000'], ['Rahul', 'Das', '55000']),
          hints: ['Name the three columns after SELECT, separated by commas.', 'Add ORDER BY emp_id so the rows come in a fixed order.'] },
        { tag: 'WHERE', task: 'Show the <strong>first_name</strong> and <strong>salary</strong> of employees who earn <strong>more than 60000</strong>, the highest salary first. If salaries tie, lower emp_id first.',
          sql: `SELECT first_name, salary
FROM Employees
WHERE salary > 60000
ORDER BY salary DESC, emp_id;`, result: t(['first_name', 'salary'], ['Asha', '95000'], ['Ravi', '72000'], ['Meera', '72000'], ['Neha', '67000'], ['Priya', '61000']),
          hints: ['WHERE filters the rows, ORDER BY sorts what is left.', 'You can sort by two columns: ORDER BY salary DESC, emp_id.'] },
        { tag: 'WHERE', task: 'Show the <strong>first_name</strong> and <strong>last_name</strong> of everyone in <strong>department 1</strong>, in emp_id order.',
          sql: `SELECT first_name, last_name
FROM Employees
WHERE dept_id = 1
ORDER BY emp_id;`, result: t(['first_name', 'last_name'], ['Asha', 'Rao'], ['Ravi', 'Kumar'], ['Meera', 'Shah'], ['Rahul', 'Das']),
          hints: ['Compare the dept_id column with the number 1.', 'Numbers do not need quotes.'] },
        { tag: 'AND', task: 'Show the <strong>first_name</strong> and <strong>salary</strong> of employees in <strong>department 1</strong> who earn <strong>at least 70000</strong>, in emp_id order.',
          sql: `SELECT first_name, salary
FROM Employees
WHERE dept_id = 1 AND salary >= 70000
ORDER BY emp_id;`, result: t(['first_name', 'salary'], ['Asha', '95000'], ['Ravi', '72000'], ['Meera', '72000']),
          hints: ['Both conditions must be true, so join them with AND.', '"At least 70000" includes 70000 itself, so use >=.'] },
        { tag: 'OR', task: 'Show the <strong>project_name</strong> and <strong>status</strong> of projects that are <strong>Active or On Hold</strong>, ordered by project_id.',
          sql: `SELECT project_name, status
FROM Projects
WHERE status = 'Active' OR status = 'On Hold'
ORDER BY project_id;`, result: t(['project_name', 'status'], ['Website Revamp', 'Active'], ['Mobile App', 'Active'], ['Payroll Upgrade', 'Active'], ['Hiring Drive', 'On Hold'], ['Brand Campaign', 'On Hold'], ['Data Lake', 'Active']),
          hints: ['A row qualifies if either condition is true: use OR.', 'Text values go in single quotes, like \'Active\'.'] },
        { tag: 'IN', task: 'Using <strong>IN</strong>, show the <strong>first_name</strong> and <strong>dept_id</strong> of employees who work in department <strong>2 or 3</strong>, in emp_id order.',
          sql: `SELECT first_name, dept_id
FROM Employees
WHERE dept_id IN (2, 3)
ORDER BY emp_id;`, result: t(['first_name', 'dept_id'], ['Karan', '2'], ['Priya', '2'], ['Sunil', '3']),
          hints: ['IN takes a list of values in brackets.', 'Write dept_id IN (2, 3).'] },
        { tag: 'BETWEEN', task: 'Show the <strong>first_name</strong> and <strong>hire_date</strong> of employees hired <strong>from 2020-01-01 to 2021-12-31</strong> (both included), in emp_id order.',
          sql: `SELECT first_name, hire_date
FROM Employees
WHERE hire_date BETWEEN '2020-01-01' AND '2021-12-31'
ORDER BY emp_id;`, result: t(['first_name', 'hire_date'], ['Ravi', '2020-07-01'], ['Meera', '2021-01-10'], ['Neha', '2020-02-20']),
          hints: ['Dates written as YYYY-MM-DD compare correctly, like text.', 'BETWEEN includes both ends.'] },
        { tag: 'LIMIT', task: 'Show the <strong>first_name</strong> and <strong>salary</strong> of the <strong>3 highest paid</strong> employees. If salaries tie, lower emp_id first.',
          sql: `SELECT first_name, salary
FROM Employees
ORDER BY salary DESC, emp_id
LIMIT 3;`, result: t(['first_name', 'salary'], ['Asha', '95000'], ['Ravi', '72000'], ['Meera', '72000']),
          hints: ['Sort by salary from big to small first.', 'Then keep only 3 rows with LIMIT 3.'] },
      ],
    },
    {
      chip: 'DISTINCT · LIKE · NULL · CASE', title: 'Text, NULL and CASE', sub: 'Remove repeats, match patterns, handle missing values and build new columns.',
      qs: [
        { tag: 'DISTINCT', task: 'List each <strong>location</strong> where the company has a department, <strong>without repeating</strong> any, in alphabetical order.',
          sql: `SELECT DISTINCT location
FROM Departments
ORDER BY location;`, result: t(['location'], ['Bangalore'], ['Chennai'], ['Delhi'], ['Mumbai']),
          hints: ['Mumbai appears twice in Departments.', 'DISTINCT goes right after SELECT.'] },
        { tag: 'LIKE', task: 'Show the <strong>first_name</strong> and <strong>last_name</strong> of employees whose first name <strong>starts with \'A\'</strong>, in emp_id order.',
          sql: `SELECT first_name, last_name
FROM Employees
WHERE first_name LIKE 'A%'
ORDER BY emp_id;`, result: t(['first_name', 'last_name'], ['Asha', 'Rao'], ['Arjun', 'Singh']),
          hints: ['% in a LIKE pattern means any number of characters.', 'The pattern \'A%\' means: starts with A.'] },
        { tag: 'LIKE', task: 'Show the <strong>first_name</strong> and <strong>email</strong> of employees whose email <strong>ends with \'@gmail.com\'</strong>, in emp_id order.',
          sql: `SELECT first_name, email
FROM Employees
WHERE email LIKE '%@gmail.com'
ORDER BY emp_id;`, result: t(['first_name', 'email'], ['Karan', 'karan.m@gmail.com'], ['Arjun', 'arjun.s@gmail.com']),
          hints: ['Put the % at the front when you know how the text ends.', 'The pattern is \'%@gmail.com\'.'] },
        { tag: 'IS NULL', task: 'Show the <strong>first_name</strong> of employees who <strong>do not belong to any department</strong> (dept_id is empty).',
          sql: `SELECT first_name
FROM Employees
WHERE dept_id IS NULL;`, result: t(['first_name'], ['Divya']),
          hints: ['NULL means no value. You cannot test it with = .', 'Write WHERE dept_id IS NULL.'] },
        { tag: 'IS NOT NULL', task: 'Show the <strong>first_name</strong> and <strong>email</strong> of employees who <strong>have an email</strong> on record, in emp_id order.',
          sql: `SELECT first_name, email
FROM Employees
WHERE email IS NOT NULL
ORDER BY emp_id;`, result: t(['first_name', 'email'], ['Asha', 'asha.rao@corp.com'], ['Ravi', 'ravi.kumar@corp.com'], ['Karan', 'karan.m@gmail.com'], ['Priya', 'priya.nair@corp.com'], ['Neha', 'neha.gupta@corp.com'], ['Arjun', 'arjun.s@gmail.com'], ['Divya', 'divya.iyer@corp.com'], ['Rahul', 'rahul.das@corp.com']),
          hints: ['Two employees have a NULL email and must be left out.', 'Use IS NOT NULL, not <> NULL.'] },
        { tag: 'COALESCE', task: 'Show the <strong>first_name</strong> and the <strong>manager_id</strong> of every employee, but show <strong>0</strong> when the manager is NULL. Name the second column <strong>manager</strong>. Order by emp_id.',
          sql: `SELECT first_name, COALESCE(manager_id, 0) AS manager
FROM Employees
ORDER BY emp_id;`, result: t(['first_name', 'manager'], ['Asha', '0'], ['Ravi', '1'], ['Meera', '1'], ['Karan', '1'], ['Priya', '4'], ['Sunil', '1'], ['Neha', '1'], ['Arjun', '7'], ['Divya', '1'], ['Rahul', '2']),
          hints: ['COALESCE(a, b) returns a, or b when a is NULL.', 'Use AS to give the new column a name.'] },
        { tag: 'String functions', task: 'Show each employee\'s <strong>last_name in capital letters</strong> (call it <strong>last_upper</strong>) and the <strong>number of characters in first_name</strong> (call it <strong>name_length</strong>). Order by emp_id.',
          sql: `SELECT UPPER(last_name) AS last_upper, LENGTH(first_name) AS name_length
FROM Employees
ORDER BY emp_id;`, result: t(['last_upper', 'name_length'], ['RAO', '4'], ['KUMAR', '4'], ['SHAH', '5'], ['MEHTA', '5'], ['NAIR', '5'], ['VERMA', '5'], ['GUPTA', '4'], ['SINGH', '5'], ['IYER', '5'], ['DAS', '5']),
          hints: ['UPPER() changes text to capitals, LENGTH() counts characters.', 'Give both new columns a name with AS.'] },
        { tag: 'Join text', task: 'Show each employee\'s <strong>full name</strong> (first name, a space, last name) as <strong>full_name</strong>, for employees in <strong>department 4</strong>, ordered by emp_id.',
          sql: `SELECT first_name || ' ' || last_name AS full_name
FROM Employees
WHERE dept_id = 4
ORDER BY emp_id;`, result: t(['full_name'], ['Neha Gupta'], ['Arjun Singh']),
          hints: ['|| glues pieces of text together.', 'Glue first_name, a space \' \' and last_name.'] },
        { tag: 'CASE', task: 'Show <strong>first_name</strong>, <strong>salary</strong> and a column <strong>band</strong>: \'High\' if salary is 70000 or more, \'Medium\' if 55000 or more, otherwise \'Low\'. Order by emp_id.',
          sql: `SELECT first_name, salary,
  CASE
    WHEN salary >= 70000 THEN 'High'
    WHEN salary >= 55000 THEN 'Medium'
    ELSE 'Low'
  END AS band
FROM Employees
ORDER BY emp_id;`, result: t(['first_name', 'salary', 'band'], ['Asha', '95000', 'High'], ['Ravi', '72000', 'High'], ['Meera', '72000', 'High'], ['Karan', '58000', 'Medium'], ['Priya', '61000', 'Medium'], ['Sunil', '48000', 'Low'], ['Neha', '67000', 'Medium'], ['Arjun', '52000', 'Low'], ['Divya', '45000', 'Low'], ['Rahul', '55000', 'Medium']),
          hints: ['CASE checks the WHEN lines from top to bottom and uses the first one that is true.', 'Check the biggest limit first, then the next one, then ELSE.'] },
      ],
    },
    {
      chip: 'Aggregates · GROUP BY · HAVING', title: 'Aggregates, GROUP BY, HAVING', sub: 'Summarise many rows into a few numbers.',
      qs: [
        { tag: 'COUNT', task: 'How many employees are there in total? Name the column <strong>total_employees</strong>.',
          sql: `SELECT COUNT(*) AS total_employees
FROM Employees;`, result: t(['total_employees'], ['10']),
          hints: ['COUNT(*) counts rows.', 'Give the result a name with AS.'] },
        { tag: 'COUNT column', task: 'How many employees <strong>have an email</strong> on record? Name the column <strong>with_email</strong>.',
          sql: `SELECT COUNT(email) AS with_email
FROM Employees;`, result: t(['with_email'], ['8']),
          hints: ['COUNT(column) counts only rows where that column is not NULL.', 'Two employees have no email, so the answer is not 10.'] },
        { tag: 'SUM · AVG · MIN · MAX', task: 'In one query, show the <strong>lowest</strong> salary (<strong>min_salary</strong>), the <strong>highest</strong> salary (<strong>max_salary</strong>) and the <strong>average</strong> salary rounded to 2 decimals (<strong>avg_salary</strong>).',
          sql: `SELECT MIN(salary) AS min_salary,
       MAX(salary) AS max_salary,
       ROUND(AVG(salary), 2) AS avg_salary
FROM Employees;`, result: t(['min_salary', 'max_salary', 'avg_salary'], ['45000', '95000', '62500.0']),
          hints: ['MIN, MAX and AVG can all sit in one SELECT.', 'ROUND(value, 2) keeps 2 decimals.'] },
        { tag: 'GROUP BY', task: 'Show how many employees work in each department: <strong>dept_id</strong> and <strong>headcount</strong>. Ignore employees without a department. Order by dept_id.',
          sql: `SELECT dept_id, COUNT(*) AS headcount
FROM Employees
WHERE dept_id IS NOT NULL
GROUP BY dept_id
ORDER BY dept_id;`, result: t(['dept_id', 'headcount'], ['1', '4'], ['2', '2'], ['3', '1'], ['4', '2']),
          hints: ['GROUP BY makes one row per dept_id.', 'Filter out the NULL department with WHERE before grouping.'] },
        { tag: 'GROUP BY + AVG', task: 'For each department show <strong>dept_id</strong> and the <strong>average salary</strong> rounded to 2 decimals as <strong>avg_salary</strong>. Ignore employees without a department. Order by dept_id.',
          sql: `SELECT dept_id, ROUND(AVG(salary), 2) AS avg_salary
FROM Employees
WHERE dept_id IS NOT NULL
GROUP BY dept_id
ORDER BY dept_id;`, result: t(['dept_id', 'avg_salary'], ['1', '73500.0'], ['2', '59500.0'], ['3', '48000.0'], ['4', '59500.0']),
          hints: ['AVG(salary) is worked out separately for each group.', 'Round it with ROUND(..., 2).'] },
        { tag: 'HAVING', task: 'Show the departments that have <strong>2 or more employees</strong>: <strong>dept_id</strong> and <strong>headcount</strong>. Order by dept_id.',
          sql: `SELECT dept_id, COUNT(*) AS headcount
FROM Employees
WHERE dept_id IS NOT NULL
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY dept_id;`, result: t(['dept_id', 'headcount'], ['1', '4'], ['2', '2'], ['4', '2']),
          hints: ['WHERE filters rows before grouping. HAVING filters groups after.', 'You need HAVING COUNT(*) >= 2.'] },
        { tag: 'WHERE + GROUP BY', task: 'For <strong>Active</strong> projects only, show each <strong>dept_id</strong> and the <strong>total budget</strong> as <strong>total_budget</strong>. Order by dept_id.',
          sql: `SELECT dept_id, SUM(budget) AS total_budget
FROM Projects
WHERE status = 'Active'
GROUP BY dept_id
ORDER BY dept_id;`, result: t(['dept_id', 'total_budget'], ['1', '2250000'], ['4', '250000']),
          hints: ['First keep only the \'Active\' rows with WHERE.', 'Then group by dept_id and add the budgets with SUM.'] },
        { tag: 'GROUP BY text', task: 'For each project <strong>status</strong>, show how many projects it has (<strong>projects</strong>) and their total budget (<strong>total_budget</strong>). Order by status.',
          sql: `SELECT status, COUNT(*) AS projects, SUM(budget) AS total_budget
FROM Projects
GROUP BY status
ORDER BY status;`, result: t(['status', 'projects', 'total_budget'], ['Active', '4', '2500000'], ['Completed', '2', '390000'], ['On Hold', '2', '520000']),
          hints: ['Group by the status column.', 'You can use COUNT and SUM together.'] },
        { tag: 'SUM + HAVING', task: 'In the Assignments table, show each <strong>project_id</strong> whose <strong>total hours are more than 250</strong>, with the total as <strong>total_hours</strong>. Order by project_id.',
          sql: `SELECT project_id, SUM(hours) AS total_hours
FROM Assignments
GROUP BY project_id
HAVING SUM(hours) > 250
ORDER BY project_id;`, result: t(['project_id', 'total_hours'], ['1', '380'], ['2', '400'], ['4', '300']),
          hints: ['Add up the hours of every project with SUM(hours).', 'Filter the totals with HAVING SUM(hours) > 250.'] },
      ],
    },
    {
      chip: 'Joins', title: 'Joins', sub: 'Combine rows from two or more tables.',
      qs: [
        { tag: 'INNER JOIN', task: 'Show each employee\'s <strong>first_name</strong> with their <strong>dept_name</strong>. Employees without a department must <strong>not</strong> appear. Order by emp_id.',
          sql: `SELECT e.first_name, d.dept_name
FROM Employees e
INNER JOIN Departments d
  ON e.dept_id = d.dept_id
ORDER BY e.emp_id;`, result: t(['first_name', 'dept_name'], ['Asha', 'Engineering'], ['Ravi', 'Engineering'], ['Meera', 'Engineering'], ['Karan', 'Sales'], ['Priya', 'Sales'], ['Sunil', 'HR'], ['Neha', 'Finance'], ['Arjun', 'Finance'], ['Rahul', 'Engineering']),
          hints: ['The shared column is dept_id.', 'INNER JOIN keeps only the matching rows.'] },
        { tag: 'LEFT JOIN', task: 'Show <strong>every employee</strong> with their <strong>dept_name</strong>. Employees with no department must still appear. Order by emp_id.',
          sql: `SELECT e.first_name, d.dept_name
FROM Employees e
LEFT JOIN Departments d
  ON e.dept_id = d.dept_id
ORDER BY e.emp_id;`, result: t(['first_name', 'dept_name'], ['Asha', 'Engineering'], ['Ravi', 'Engineering'], ['Meera', 'Engineering'], ['Karan', 'Sales'], ['Priya', 'Sales'], ['Sunil', 'HR'], ['Neha', 'Finance'], ['Arjun', 'Finance'], ['Divya', 'NULL'], ['Rahul', 'Engineering']),
          hints: ['Which table must be kept in full? Write it before LEFT JOIN.', 'Divya has no department, so her dept_name is NULL.'] },
        { tag: 'Unmatched rows', task: 'Find the departments that have <strong>no employees</strong>. Show the <strong>dept_name</strong>.',
          sql: `SELECT d.dept_name
FROM Departments d
LEFT JOIN Employees e
  ON d.dept_id = e.dept_id
WHERE e.emp_id IS NULL;`, result: t(['dept_name'], ['Legal']),
          hints: ['Start from Departments and LEFT JOIN Employees.', 'Keep the rows where the Employees side is NULL.'] },
        { tag: 'JOIN + COUNT', task: 'For <strong>every department</strong> show the <strong>dept_name</strong> and the number of employees as <strong>headcount</strong> (0 if none). Order by d.dept_id.',
          sql: `SELECT d.dept_name, COUNT(e.emp_id) AS headcount
FROM Departments d
LEFT JOIN Employees e
  ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY d.dept_id;`, result: t(['dept_name', 'headcount'], ['Engineering', '4'], ['Sales', '2'], ['HR', '1'], ['Finance', '2'], ['Legal', '0']),
          hints: ['LEFT JOIN keeps the department with no employees.', 'COUNT(e.emp_id) ignores NULL, so Legal gets 0.'] },
        { tag: 'JOIN + WHERE', task: 'Show the <strong>first_name</strong>, <strong>dept_name</strong> and <strong>location</strong> of employees whose department is in <strong>Mumbai</strong>. Order by emp_id.',
          sql: `SELECT e.first_name, d.dept_name, d.location
FROM Employees e
JOIN Departments d
  ON e.dept_id = d.dept_id
WHERE d.location = 'Mumbai'
ORDER BY e.emp_id;`, result: t(['first_name', 'dept_name', 'location'], ['Karan', 'Sales', 'Mumbai'], ['Priya', 'Sales', 'Mumbai'], ['Neha', 'Finance', 'Mumbai'], ['Arjun', 'Finance', 'Mumbai']),
          hints: ['The location column lives in Departments.', 'Join first, then filter with WHERE d.location = \'Mumbai\'.'] },
        { tag: 'Self join', task: 'Show each employee\'s <strong>first_name</strong> as <strong>employee</strong> and their manager\'s first name as <strong>manager</strong>. Employees without a manager must still appear. Order by emp_id.',
          sql: `SELECT e.first_name AS employee, m.first_name AS manager
FROM Employees e
LEFT JOIN Employees m
  ON e.manager_id = m.emp_id
ORDER BY e.emp_id;`, result: t(['employee', 'manager'], ['Asha', 'NULL'], ['Ravi', 'Asha'], ['Meera', 'Asha'], ['Karan', 'Asha'], ['Priya', 'Karan'], ['Sunil', 'Asha'], ['Neha', 'Asha'], ['Arjun', 'Neha'], ['Divya', 'Asha'], ['Rahul', 'Ravi']),
          hints: ['Use the Employees table twice, with two different aliases (e and m).', 'e.manager_id points to m.emp_id. Asha has no manager, so use LEFT JOIN.'] },
        { tag: '3-table JOIN', task: 'Show each employee\'s <strong>first_name</strong>, the <strong>project_name</strong> they work on and their <strong>hours</strong>. Order by emp_id, then project_id.',
          sql: `SELECT e.first_name, p.project_name, a.hours
FROM Assignments a
JOIN Employees e ON e.emp_id = a.emp_id
JOIN Projects p  ON p.project_id = a.project_id
ORDER BY e.emp_id, p.project_id;`, result: t(['first_name', 'project_name', 'hours'], ['Asha', 'Website Revamp', '120'], ['Asha', 'Mobile App', '80'], ['Ravi', 'Website Revamp', '200'], ['Ravi', 'Mobile App', '150'], ['Ravi', 'Data Lake', '100'], ['Meera', 'Mobile App', '170'], ['Meera', 'Data Lake', '75'], ['Karan', 'Sales Portal', '90'], ['Priya', 'Sales Portal', '110'], ['Neha', 'Payroll Upgrade', '140'], ['Arjun', 'Payroll Upgrade', '160'], ['Rahul', 'Website Revamp', '60']),
          hints: ['Assignments sits in the middle: it holds both emp_id and project_id.', 'Each JOIN needs its own ON condition.'] },
        { tag: 'JOIN + SUM', task: 'Show each employee\'s <strong>first_name</strong> and the <strong>total hours</strong> they worked as <strong>total_hours</strong>. Biggest total first. If totals tie, lower emp_id first. Employees with no assignment are not needed.',
          sql: `SELECT e.first_name, SUM(a.hours) AS total_hours
FROM Employees e
JOIN Assignments a ON a.emp_id = e.emp_id
GROUP BY e.emp_id, e.first_name
ORDER BY total_hours DESC, e.emp_id;`, result: t(['first_name', 'total_hours'], ['Ravi', '450'], ['Meera', '245'], ['Asha', '200'], ['Arjun', '160'], ['Neha', '140'], ['Priya', '110'], ['Karan', '90'], ['Rahul', '60']),
          hints: ['Join Employees to Assignments, then group by employee.', 'Sort by the SUM alias, biggest first.'] },
        { tag: 'Unmatched rows', task: 'Find the <strong>projects nobody is assigned to</strong>. Show <strong>project_name</strong>, ordered by project_id.',
          sql: `SELECT p.project_name
FROM Projects p
LEFT JOIN Assignments a
  ON p.project_id = a.project_id
WHERE a.emp_id IS NULL
ORDER BY p.project_id;`, result: t(['project_name'], ['Hiring Drive'], ['Cost Audit'], ['Brand Campaign']),
          hints: ['LEFT JOIN from Projects to Assignments.', 'Projects with no matching assignment have NULL on the Assignments side.'] },
      ],
    },
    {
      chip: 'Subqueries · UNION · EXCEPT', title: 'Subqueries and set operations', sub: 'A query inside a query, and combining two result lists.',
      qs: [
        { tag: 'Scalar subquery', task: 'Show the <strong>first_name</strong> and <strong>salary</strong> of employees who earn <strong>more than the average salary</strong>. Highest first, ties by emp_id.',
          sql: `SELECT first_name, salary
FROM Employees
WHERE salary > (SELECT AVG(salary) FROM Employees)
ORDER BY salary DESC, emp_id;`, result: t(['first_name', 'salary'], ['Asha', '95000'], ['Ravi', '72000'], ['Meera', '72000'], ['Neha', '67000']),
          hints: ['First find the average with its own small query in brackets.', 'Compare salary with that bracketed query.'] },
        { tag: 'IN subquery', task: 'Show the <strong>first_name</strong> of employees who work in a department located in <strong>Mumbai</strong>. Use a subquery with IN. Order by emp_id.',
          sql: `SELECT first_name
FROM Employees
WHERE dept_id IN (
  SELECT dept_id
  FROM Departments
  WHERE location = 'Mumbai'
)
ORDER BY emp_id;`, result: t(['first_name'], ['Karan'], ['Priya'], ['Neha'], ['Arjun']),
          hints: ['The inner query returns the dept_id of Mumbai departments.', 'The outer query keeps employees whose dept_id is in that list.'] },
        { tag: 'NOT IN', task: 'Show the <strong>first_name</strong> of employees who are <strong>not assigned to any project</strong>. Order by emp_id.',
          sql: `SELECT first_name
FROM Employees
WHERE emp_id NOT IN (SELECT emp_id FROM Assignments)
ORDER BY emp_id;`, result: t(['first_name'], ['Sunil'], ['Divya']),
          hints: ['The inner query lists every emp_id that appears in Assignments.', 'NOT IN keeps the employees who are not on that list.'] },
        { tag: 'EXISTS', task: 'Show the <strong>dept_name</strong> of departments that have <strong>at least one Active project</strong>. Order by dept_id.',
          sql: `SELECT d.dept_name
FROM Departments d
WHERE EXISTS (
  SELECT 1
  FROM Projects p
  WHERE p.dept_id = d.dept_id
    AND p.status = 'Active'
)
ORDER BY d.dept_id;`, result: t(['dept_name'], ['Engineering'], ['Finance']),
          hints: ['EXISTS asks: does the inner query return at least one row?', 'The inner query is linked to the outer one with p.dept_id = d.dept_id.'] },
        { tag: 'Correlated subquery', task: 'Show the <strong>highest paid employee of each department</strong>: <strong>first_name</strong>, <strong>dept_id</strong> and <strong>salary</strong>. Order by dept_id.',
          sql: `SELECT first_name, dept_id, salary
FROM Employees e
WHERE salary = (
  SELECT MAX(salary)
  FROM Employees
  WHERE dept_id = e.dept_id
)
ORDER BY dept_id;`, result: t(['first_name', 'dept_id', 'salary'], ['Asha', '1', '95000'], ['Priya', '2', '61000'], ['Sunil', '3', '48000'], ['Neha', '4', '67000']),
          hints: ['For each employee, ask: is my salary the MAX of my own department?', 'The inner query uses e.dept_id from the outer row. Divya has no department, so she is left out.'] },
        { tag: 'UNION ALL', task: 'Make <strong>one list</strong> with a <strong>name</strong> column and a <strong>type</strong> column: the first names of employees in department 1 (type \'Employee\') followed by the names of <strong>Active</strong> projects (type \'Project\'). Order by type, then name.',
          sql: `SELECT first_name AS name, 'Employee' AS type
FROM Employees
WHERE dept_id = 1
UNION ALL
SELECT project_name, 'Project'
FROM Projects
WHERE status = 'Active'
ORDER BY type, name;`, result: t(['name', 'type'], ['Asha', 'Employee'], ['Meera', 'Employee'], ['Rahul', 'Employee'], ['Ravi', 'Employee'], ['Data Lake', 'Project'], ['Mobile App', 'Project'], ['Payroll Upgrade', 'Project'], ['Website Revamp', 'Project']),
          hints: ['UNION ALL stacks two results. Both need the same number of columns.', 'Put ORDER BY once, at the very end. It sorts the combined list.'] },
        { tag: 'EXCEPT', task: 'Using <strong>EXCEPT</strong>, find the <strong>dept_id</strong> values in Departments that have <strong>no project</strong> in the Projects table.',
          sql: `SELECT dept_id
FROM Departments
EXCEPT
SELECT dept_id
FROM Projects;`, result: t(['dept_id'], ['5']),
          hints: ['EXCEPT returns what is in the first list but not in the second.', 'First list: all dept_id in Departments. Second list: dept_id in Projects.'] },
      ],
    },
    {
      chip: 'CTE · Windows · Changing data', title: 'CTEs, window functions and changing data', sub: 'Name a step with WITH, rank rows, then INSERT, UPDATE and DELETE.',
      qs: [
        { tag: 'CTE', task: 'Show the employees who earn <strong>more than the average of their own department</strong>: <strong>first_name</strong>, <strong>salary</strong> and the department average as <strong>dept_avg</strong> (rounded to 2 decimals). Use a CTE. Order by emp_id.',
          sql: `WITH dept_avg AS (
  SELECT dept_id, ROUND(AVG(salary), 2) AS avg_salary
  FROM Employees
  GROUP BY dept_id
)
SELECT e.first_name, e.salary, d.avg_salary AS dept_avg
FROM Employees e
JOIN dept_avg d ON d.dept_id = e.dept_id
WHERE e.salary > d.avg_salary
ORDER BY e.emp_id;`, result: t(['first_name', 'salary', 'dept_avg'], ['Asha', '95000', '73500.0'], ['Priya', '61000', '59500.0'], ['Neha', '67000', '59500.0']),
          hints: ['Step 1 (the CTE): average salary per department.', 'Step 2: join it to Employees and keep salary > average.'] },
        { tag: 'RANK', task: 'Rank all employees by salary, highest first: show <strong>first_name</strong>, <strong>salary</strong> and <strong>salary_rank</strong> (use RANK). Order by salary_rank, then emp_id.',
          sql: `SELECT first_name, salary,
  RANK() OVER (ORDER BY salary DESC) AS salary_rank
FROM Employees
ORDER BY salary_rank, emp_id;`, result: t(['first_name', 'salary', 'salary_rank'], ['Asha', '95000', '1'], ['Ravi', '72000', '2'], ['Meera', '72000', '2'], ['Neha', '67000', '4'], ['Priya', '61000', '5'], ['Karan', '58000', '6'], ['Rahul', '55000', '7'], ['Arjun', '52000', '8'], ['Sunil', '48000', '9'], ['Divya', '45000', '10']),
          hints: ['RANK() OVER (ORDER BY salary DESC) numbers the rows.', 'Equal salaries get the same rank and the next number is skipped.'] },
        { tag: 'PARTITION BY', task: 'Number the employees <strong>inside each department</strong> from highest to lowest salary. Show <strong>first_name</strong>, <strong>dept_id</strong>, <strong>salary</strong> and <strong>pos</strong> (use ROW_NUMBER). Ignore employees without a department. Order by dept_id, then pos.',
          sql: `SELECT first_name, dept_id, salary,
  ROW_NUMBER() OVER (
    PARTITION BY dept_id
    ORDER BY salary DESC, emp_id
  ) AS pos
FROM Employees
WHERE dept_id IS NOT NULL
ORDER BY dept_id, pos;`, result: t(['first_name', 'dept_id', 'salary', 'pos'], ['Asha', '1', '95000', '1'], ['Ravi', '1', '72000', '2'], ['Meera', '1', '72000', '3'], ['Rahul', '1', '55000', '4'], ['Priya', '2', '61000', '1'], ['Karan', '2', '58000', '2'], ['Sunil', '3', '48000', '1'], ['Neha', '4', '67000', '1'], ['Arjun', '4', '52000', '2']),
          hints: ['PARTITION BY dept_id restarts the numbering for each department.', 'Add emp_id to the window ORDER BY so ties are broken the same way every time.'] },
        { tag: 'LAG', task: 'Order employees by hire_date and show <strong>first_name</strong>, <strong>hire_date</strong>, <strong>salary</strong> and the salary of the <strong>previously hired</strong> employee as <strong>prev_salary</strong> (use LAG).',
          sql: `SELECT first_name, hire_date, salary,
  LAG(salary) OVER (ORDER BY hire_date) AS prev_salary
FROM Employees
ORDER BY hire_date;`, result: t(['first_name', 'hire_date', 'salary', 'prev_salary'], ['Sunil', '2017-08-14', '48000', 'NULL'], ['Karan', '2018-11-23', '58000', '48000'], ['Asha', '2019-03-15', '95000', '58000'], ['Neha', '2020-02-20', '67000', '95000'], ['Ravi', '2020-07-01', '72000', '67000'], ['Meera', '2021-01-10', '72000', '72000'], ['Priya', '2022-05-02', '61000', '72000'], ['Divya', '2023-01-30', '45000', '61000'], ['Arjun', '2023-09-05', '52000', '45000'], ['Rahul', '2024-04-18', '55000', '52000']),
          hints: ['LAG(column) looks at the previous row in the window order.', 'The first row has no previous row, so it shows NULL.'] },
        { tag: 'INSERT', task: 'Add a new department <strong>(6, \'Marketing\', \'Pune\')</strong>, then show the row you added (only that department).',
          sql: `INSERT INTO Departments VALUES (6, 'Marketing', 'Pune');

SELECT *
FROM Departments
WHERE dept_id = 6;`, result: t(['dept_id', 'dept_name', 'location'], ['6', 'Marketing', 'Pune']),
          hints: ['INSERT INTO Departments VALUES (...) needs a value for every column, in order.', 'End with a SELECT with WHERE dept_id = 6 to see the new row.'] },
        { tag: 'UPDATE', task: 'Give everyone in <strong>department 2</strong> a raise of <strong>5000</strong>, then show their <strong>first_name</strong> and new <strong>salary</strong> in emp_id order.',
          sql: `UPDATE Employees
SET salary = salary + 5000
WHERE dept_id = 2;

SELECT first_name, salary
FROM Employees
WHERE dept_id = 2
ORDER BY emp_id;`, result: t(['first_name', 'salary'], ['Karan', '63000'], ['Priya', '66000']),
          hints: ['In SET you can use the old value: salary = salary + 5000.', 'Never forget WHERE, or everybody gets the raise.'] },
        { tag: 'DELETE', task: 'Delete every project that is <strong>On Hold</strong>, then show the remaining <strong>project_id</strong> and <strong>project_name</strong>, ordered by project_id.',
          sql: `DELETE FROM Projects
WHERE status = 'On Hold';

SELECT project_id, project_name
FROM Projects
ORDER BY project_id;`, result: t(['project_id', 'project_name'], ['1', 'Website Revamp'], ['2', 'Mobile App'], ['3', 'Sales Portal'], ['4', 'Payroll Upgrade'], ['6', 'Cost Audit'], ['8', 'Data Lake']),
          hints: ['DELETE FROM table WHERE condition removes the matching rows.', 'Two projects are On Hold, so six projects remain.'] },
      ],
    },
  ];

  addQuiz({
    id: 'sql-quiz-practice',
    title: 'Quiz 3: Practice Lab',
    description: '50 tasks on a new set of tables (Departments, Employees, Projects, Assignments). Basic to intermediate.',
    intro: buildPage({
      kind: 'write', level: 'Quiz 3', title: 'Practice lab',
      intro: 'Fifty tasks that start with a plain SELECT and grow to joins, subqueries, CTEs and window functions. This quiz has its own four tables: paste the setup SQL into the compiler once, then write each query and compare your output with the expected output. Open the explanation, or the solution, only when you need it.',
      items: ['50 tasks, basic to intermediate', 'Filtering, text, NULL and CASE', 'Aggregates, GROUP BY, HAVING', 'INNER, LEFT and self joins, 3-table joins', 'Subqueries, EXISTS, UNION, EXCEPT', 'CTEs, RANK, ROW_NUMBER, LAG', 'INSERT, UPDATE, DELETE'],
      groups,
      idPrefix: 'p',
      ref: {
        sub: 'Four small tables for a company: departments, employees, projects and who works on what. Every task on this page uses them.',
        band,
        setup: SETUP,
        note: 'Tasks 48, 49 and 50 change the data. Run this setup again to get the original tables back. Every expected output assumes the original data.',
      },
    }),
  });
})();
