cd ~/code/angular/hanoi
ng build --prod
cd ~/code/angular/hanoi/dist/hanoi 
aws s3 sync . s3://hanoi.mymisc.info