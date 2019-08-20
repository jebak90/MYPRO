import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, ResponseType, ResponseOptions } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    uploadedFiles = [] ;
    public formGroup = this.fb.group({
      file: [null, Validators.required]
    });
    private fileName;
    constructor(private fb: FormBuilder, private http: Http) { }
    // constructor(private http: Http) {

    // }

    ngOnInit() {
      this.getFileList();
    }

    fileChange(element) {
        this.uploadedFiles = element.target.files;
    }

    upload(fName, fValue) {
        const formData = new FormData();

        // for (const iterator of this.uploadedFiles) {
        //   formData.append('uploads[]', iterator, iterator.name);
        // }

        this.http.post('http://localhost:3000/api/fileupload', {name: fName, content: fValue})
            .subscribe((response) => {
                console.log('response received is ', response);
                this.getFileList();
            });
    }

    public onFileChange(event) {
      const reader = new FileReader();

      if (event.target.files && event.target.files.length) {
        this.fileName = event.target.files[0].name;
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.formGroup.patchValue({
            file: reader.result
          });
        };
      }
    }

    public onSubmit(): void {
      console.log(this.fileName);
      this.upload(this.fileName, this.formGroup.get('file').value);
    }

    public getFileList() {
       this.http.get('http://localhost:3000/api/listFile').subscribe(
        (res) => {
          this.uploadedFiles = res.json();
        }
      );
    }

    public downloadFile(fileName) {
      console.log(fileName);
      this.http.get('http://localhost:3000/files/' + fileName).subscribe(res => {
        console.log(res.url);
        window.open(res.url);

      });
    }

    public deleteFile(fileName) {
      this.http.get('http://localhost:3000/api/delFile/' + fileName).subscribe(
        (res) => {
          console.log(res);
          this.getFileList();
        }
      );
    }

}
