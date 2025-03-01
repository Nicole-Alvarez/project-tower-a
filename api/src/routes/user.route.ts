import { Context, Hono } from "hono";
import { findAllStudents, findAllTeachers, findAllUsers, findRecentNumberOfStudents, findUserAdmin, findUserById, totalUsersPerUserType, updateUser, updateUserImage } from "../services/users";
 import { zValidator } from "@hono/zod-validator";
import { storage } from "../helpers/storage";
import { getSignedUrl, removeObject, uploadUserImage } from "../utils/minio";
import argon2 from "argon2"; 
import { updateUserImageProfileSchema } from "../schemas/user.schema";
import { uploadSingleImage } from "../services/upload"; 

const userRoutes = new Hono();

 


userRoutes.get('/admin/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const user = await findUserAdmin(id);

    if(user?.profilePicture) {
      user.profilePicture = await getSignedUrl(user.profilePicture);
    }

    return c.json(user, 200);
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
});

userRoutes.get('/', async (c: Context) => {
  try {
    const users =  await findAllUsers();

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.profilePicture) {
          const signedUrl = await getSignedUrl(user.profilePicture);
          return {
            ...user,
            profilePicture: signedUrl,
          };
        }
        return user;
      })
    );

    if(!users) {
      throw new Error('Failed to get users');
    }
    return c.json({users: updatedUsers}, 200);
  } catch(error) {
    return c.json({ message: "Internal server error" }, 500);
  }
});

  

userRoutes.get('/students/recent-numbers', async (c: Context) => {
  try {
    const today = String(c.req.query('today'));
    const students = await findRecentNumberOfStudents({
      today,
    });

    if (students === null) return c.text("enrolled courses not found", 200);

    return c.json({ students: students }, 200);
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
});


 

userRoutes.put('/:id/image',
  zValidator('param', updateUserImageProfileSchema.param),
  storage.single('image'),
  async (c: Context) => {
    try {
      const id = Number(c.req.param('id'));
      const { image, userType } = await c.req.parseBody();

      if (!image) {
        return c.json({ message: 'Image file is required' }, 400);
      }
      if (!userType) {
        return c.json({ message: 'User type is required' }, 400);
      }

      let user;
      if (userType === "ADMIN") {
        user = await findUserAdmin(id);
      } else if (userType === "TEACHER") {
        user = await findUserById(id);
      } 
      else if (userType === "STUDENT") {
        user = await findUserById(id);
      }
      else {
        return c.json({ message: 'Invalid user type' }, 400);
      }

      if (!user) {
        return c.json({ message: 'User not found!' }, 404);
      }

      if (user.profilePicture) {
        await removeObject(user.profilePicture); 
      }
      const uploaded = await uploadSingleImage(image as File, 'user');

      const updated = await updateUserImage({
        userType,
        id,
        image: `images/user/${uploaded.originalFileName}`
      });

      if (!updated) {
        throw new Error('Failed to update user image');
      }

      return c.json({ message: 'User image updated successfully' }, 200);

    } catch (error) {
      return c.json('Internal server error', 500);
    }
  }
);




export default userRoutes;

