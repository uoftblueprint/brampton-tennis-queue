# BTQ - Brampton Tennis Queue

Our objective is to build an online queue system for local tennis courts in the City of Brampton with real-time notifications, no-shows, and dynamic buffer time tracking. The system should prioritize ease of use, especially for elderly people, and ensure privacy and data security. We are working with the City of Brampton's recreation team to launch this app in local courts by Summer 2025!

# Check it Out --> [LIVE](https://brampton-tennis-queue.vercel.app)

# Design Doc

Please feel free to read more about the design of this application, [here](https://docs.google.com/document/d/1Ui6mYDrbuQC5Tl4TUFB8XBBM1mwDR22gHWNCKHmXWTc/edit?usp=sharing).

# Contributors (2024-25)
- [Raunak Madan](https://www.linkedin.com/in/raunak-madan) - Project Lead
- [Christie Ko](https://www.linkedin.com/in/christieko/) - Product Manager
- [Steven Lin](https://www.linkedin.com/in/yuchenguoft/) - Designer
- [Ron Varshavsky](https://www.linkedin.com/in/ronvarshavsky/) - Developer
- [Divyansh Kachchhava](https://www.linkedin.com/in/divyansh-kachchhava-09b265228/) - Developer
- [Leandro Brasil](https://www.linkedin.com/in/leandrohamaguchi/) - Developer
- [Jamie Han](https://www.linkedin.com/in/jameshan27/) - Developer
- [Alan Su](https://www.linkedin.com/in/alan-su-144b58171/) - Developer
- [Aina Merchant](https://www.linkedin.com/in/aina-fatema-merchant-a12295221/) - Developer

# Useful Git Commands / Workflow
- **`git clone <repo link>`**: Clone the repo to your computer. Click the green "Code" button and copy the link under the "HTTPS" section.  
- **`git checkout -b <branch name>`**: Create a new branch with the specified name. All of your changes for a specific ticket should be made here! Example name: `add-profile-page`.  
- **`git pull origin main`**: Pull changes from the main branch into your current branch. It's a good practice to do this regularly to stay updated.  
- **`git status`**: This command shows the current state of changes. It should be done before and after using `git add`.  
- **`git add .` / `git add <file name>`**: Use `git add .` to stage all files or `git add <file name>` to stage a specific file.  
- **`git commit -m "Describe what was changed"`**: Commit your changes with a detailed message that describes what was changed.  
- **`git push origin <branch name>`**: Push your changes to the branch on GitHub. You must specify the branch name because GitHub won’t know which branch you’re referring to.  
- **Create a Pull Request**: Go to the repo page and click "New Pull Request". You will need **at least one review** to merge into the main branch.  

# Getting Setup
- After cloning the repo to your local files, do the following:  
1. `cd brampton-tennis-queue`  
4. `cd backend`  
5. `npm install`  
6. `cd ../frontend`  
7. `npm install`  
8. Insert the `firebase-admin.json` file into the `backend` directory  
9. Insert the `firebase.ts` file into the `frontend/src` directory
10. Ensure you can run the shell apps:
11. `cd backend`
12. `node index.js`
13. `cd ../frontend`
14. `npm run dev`  

# License
[MIT](https://github.com/uoftblueprint/brampton-tennis-queue/blob/main/LICENSE)
