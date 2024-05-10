# Helm Take Home Project
## To Run

  
### Set up frontend
```
cd frontend    
npm run build    
npm run start
```
A frontend server should now be running on `http://localhost:3000`
  
  
### Set up backend
```
cd backend
```
  
Set up virtualenv and install requirements

```
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
```
  
Bring up backend server
```
uvicorn main:app --reload
```
A backend server should now be running on `http://localhost:8000`


  
### Visit application on browser

The site is now available and running at `http://localhost:3000`


### Demo Video


https://github.com/ammathew/helm-test/assets/5540030/699e6a61-d4ef-490c-abff-c0784e492a1b


