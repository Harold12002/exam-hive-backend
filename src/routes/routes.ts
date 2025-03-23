import { Biology } from "../controllers/biology.ts";
import { Chemistry } from "../controllers/chemistry.ts";
import { Computer } from "../controllers/computer.ts";
import { GeneralKnowledge } from "../controllers/generalKnowledge.ts";
import { Physics } from "../controllers/physics.ts";
import { QuestionsControllers } from "../controllers/questions.ts";
import { Science } from "../controllers/science.ts";
import { UserControllers } from "../controllers/userRegistration.ts";
import { Router } from "../imports/imports.ts";
import { authMiddleware } from "../../authMiddleware.ts";
import { roleMiddleware } from "../helpers/userHelpers.ts";

const userControllers = new UserControllers();
const questionControllers = new QuestionsControllers();
const generalKnowledgeControllers = new GeneralKnowledge();
const scienceControllers = new Science();
const biologyControllers = new Biology();
const chemistryControllers = new Chemistry();
const physicsControllers = new Physics();
const computerControllers = new Computer();
const router = new Router();

//User routes
router.post("/register", userControllers.handleRegister);
router.post("/login", userControllers.handleLogin);
router.post("/request-reset", userControllers.requestPasswordReset);
router.post("/reset-password", userControllers.resetPassword);

//science routes
router.post(
    "/add-science",
    authMiddleware,
    roleMiddleware("Admin"),
    scienceControllers.addScienceQuestions,
);
router.get(
    "/random-science",
    authMiddleware,
    scienceControllers.randomScienceQuestions,
);
router.get("/sci-test1", scienceControllers.testOne);
router.get("/sci-test2", authMiddleware, scienceControllers.testTwo);
router.get("/sci-test3", authMiddleware, scienceControllers.testThree);
router.get("/sci-test4", authMiddleware, scienceControllers.testFour);
router.get("/sci-test5", authMiddleware, scienceControllers.testFive);

//physics routes
router.post(
    "/add-physics",
    authMiddleware,
    roleMiddleware("Admin"),
    physicsControllers.addPhysicsQuestions,
);
router.get(
    "/random-physics",
    authMiddleware,
    physicsControllers.randomPhysicsQuestions,
);
router.get("/phys-test1", authMiddleware, physicsControllers.testOne);
router.get("/phys-test2", authMiddleware, physicsControllers.testTwo);
router.get("/phys-test3", authMiddleware, physicsControllers.testThree);
router.get("/phys-test4", authMiddleware, physicsControllers.testFour);
router.get("/phys-test5", authMiddleware, physicsControllers.testFive);

//computer routes
router.post(
    "/add-computer",
    authMiddleware,
    roleMiddleware("Admin"),
    computerControllers.addComputerQuestions,
);
router.get(
    "/random-computer",
    authMiddleware,
    computerControllers.randomComputerQuestions,
);
router.get("/comp-test1", authMiddleware, computerControllers.testOne);
router.get("/comp-test2", authMiddleware, computerControllers.testTwo);
router.get("/comp-test3", authMiddleware, computerControllers.testThree);

//Biology routes
router.post(
    "/add-biology",
    authMiddleware,
    roleMiddleware("Admin"),
    biologyControllers.addBiologyQuestions,
);
router.get(
    "/random-biology",
    authMiddleware,
    biologyControllers.randomBioQuestions,
);
router.get("/bio-test1", authMiddleware, biologyControllers.testOne);
router.get("/bio-test2", authMiddleware, biologyControllers.testTwo);

//Chemistry routes
router.post(
    "/add-chemistry",
    authMiddleware,
    roleMiddleware("Admin"),
    chemistryControllers.addChemistryQuestions,
);
router.get(
    "/chemistry-random",
    authMiddleware,
    chemistryControllers.randomChemistryQuestions,
);
router.get("/chem-test1", authMiddleware, chemistryControllers.testOne);
router.get("/chem-test2", authMiddleware, chemistryControllers.testTwo);
router.get("/chem-test3", authMiddleware, chemistryControllers.testThree);

//general knowledge routes
router.get("/gk-test1", authMiddleware, generalKnowledgeControllers.testOne);
router.get("/gk-test2", authMiddleware, generalKnowledgeControllers.testTwo);
router.get("/gk-test3", authMiddleware, generalKnowledgeControllers.testThree);
router.get("/gk-test4", authMiddleware, generalKnowledgeControllers.testFour);
router.get("/gk-test5", authMiddleware, generalKnowledgeControllers.testFive);
router.get("/gk-test6", authMiddleware, generalKnowledgeControllers.testSix);
router.get("/gk-test7", authMiddleware, generalKnowledgeControllers.testSeven);
router.get("/gk-test8", authMiddleware, generalKnowledgeControllers.testEight);
router.post(
    "/add-general",
    authMiddleware,
    roleMiddleware("Admin"),
    generalKnowledgeControllers.addGeneralKnowledgeQuestions,
);
router.get(
    "/random-general",
    authMiddleware,
    generalKnowledgeControllers.randomGeneralQuestions,
);

//questions routes
router.get("/quick-test", authMiddleware, questionControllers.handleTest);
router.get("/all-questions", questionControllers.getAllQuestions);
router.post("/answers", authMiddleware, questionControllers.handleAnswers);
router.post(
    "/add-questions",
    authMiddleware,
    roleMiddleware("Admin"),
    questionControllers.addQuestions,
);

export default router;
