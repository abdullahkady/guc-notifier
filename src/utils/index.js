const generateGraphQL = (user, pass) => `query{\nstudent(username: "${user}", password: "${pass}"){\nisAuthorized\ncourses{\ncode\ncoursework{\ntype\ngrade\nmaximumGrade\n}\n\n}\n}\n}`;

export { generateGraphQL }; // eslint-disable-line
