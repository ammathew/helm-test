# Helm Take Home Project
## To Run

### Build frontend
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
  
#### Set up virtualenv and install requirements

```
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
```
  
#### Bring up backend server
```
uvicorn main:app --reload
```
A backend server should now be running on `http://localhost:8000`

  
### Visit application on browser

The site is now available and running at `http://localhost:3000`



