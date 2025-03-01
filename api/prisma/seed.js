import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.courseLessonProgress.deleteMany();
  await prisma.courseLessonItemAsset.deleteMany();
  await prisma.courseLessonItem.deleteMany();
  await prisma.courseLesson.deleteMany();
  await prisma.enrolledCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      return prisma.category.create({
        data: {
          name: faker.commerce.department(),
        },
      });
    })
  );

  // Create courses and related data
  const courses = await Promise.all(
    categories.map(async (category) => {
      const newCourses = await prisma.course.createMany({
        data: Array.from({ length: 10 }).map(() => ({
          title: faker.company.catchPhrase(),
          isCreatedBySystemUser: faker.datatype.boolean(),
          image: faker.image.url(),
          overview: faker.lorem.paragraph(),
          language: "English",
          categoryId: category.id,
        })),
      });

      return newCourses;
    })
  );

  // Find all courses
  const allCourses = await prisma.course.findMany();

  // Create lessons and related items for each course
  await Promise.all(
    allCourses.map(async (course) => {
      const newLessons = await prisma.courseLesson.createMany({
        data: Array.from({ length: 3 }).map((_, index) => ({
          ordinalNumber: index + 1,
          title: faker.company.buzzPhrase(),
          description: faker.lorem.sentence(),
          courseId: course.id,
        })),
      });

      // Find all lessons for the course
      const createdLessons = await prisma.courseLesson.findMany({
        where: {
          courseId: course.id,
        },
      });

      await Promise.all(
        createdLessons.map(async (lesson) => {
          const newLessonItems = await prisma.courseLessonItem.createMany({
            data: Array.from({ length: 2 }).map((_, index) => ({
              ordinalNumber: index + 1,
              title: faker.company.catchPhrase(),
              type: faker.helpers.arrayElement([
                "VIDEO",
                "QUESTIONNAIRE",
                "WYSIWYG",
              ]),
              courseLessonId: lesson.id,
            })),
          });

          const createdLessonItems = await prisma.courseLessonItem.findMany({
            where: {
              courseLessonId: lesson.id,
            },
          });

          await Promise.all(
            createdLessonItems.map(async (lessonItem) => {
              return prisma.courseLessonItemAsset.createMany({
                data: Array.from({ length: 2 }).map(() => ({
                  url: faker.internet.url(),
                  CourseLessonItemId: lessonItem.id,
                })),
              });
            })
          );
        })
      );
    })
  );

  // Find all users
  const users = await prisma.user.findMany();

  // Enroll users in courses
  await Promise.all(
    users.map(async (user) => {
      return prisma.enrolledCourse.createMany({
        data: Array.from({ length: 3 }).map(() => ({
          courseId: faker.helpers.arrayElement(allCourses).id,
          studentId: user.id,
        })),
      });
    })
  );

  console.log("Database seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
