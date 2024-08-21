import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object){}

  loadCountryData(svgCountry: SVGPathElement): Observable<any> {
    let api: string = `https://api.worldbank.org/v2/country/${svgCountry.id}?format=json`;
    return this.http.get(api); //Uses HttpClient to get the Observable data from worldbank API
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // for DOM maniupulation 
      let svgCountryPaths = document.querySelectorAll<SVGPathElement>('path');

      Array.prototype.forEach.call(svgCountryPaths, (svgCountry: SVGPathElement) => {

        svgCountry.addEventListener('mouseover', () => {
          this.loadCountryData(svgCountry).subscribe(data => {
            let dataPath: any = data[1];

            //Data from API call
            let name: string = dataPath[0].name;
            document.getElementById('name')!.innerText = name;

            let capital: string = dataPath[0].capitalCity;
            document.getElementById('capital')!.innerText = capital;

            let region: string = dataPath[0].region.value;
            document.getElementById('region')!.innerText = region;

            let income: string = dataPath[0].incomeLevel.value;
            document.getElementById('income')!.innerText = income;

            let longitude: string = dataPath[0].longitude;
            document.getElementById('longitude')!.innerText = longitude;

            let latitude: string = dataPath[0].latitude;
            document.getElementById('latitude')!.innerText = latitude;

          });
        });

        //once selected, changes the color of the country
        svgCountry.addEventListener('mouseover', (event:MouseEvent)=> {
          const path = event.target as SVGPathElement;
          path.style.fill = '#006622';
        });

        // once mouse leaves, changes back to starting color
        svgCountry.addEventListener('mouseleave', (event:MouseEvent)=> {
          const path = event.target as SVGPathElement;
          path.style.fill = '';

          document.getElementById('name')!.innerText = '';
          document.getElementById('capital')!.innerText = '';
          document.getElementById('region')!.innerText = '';
          document.getElementById('income')!.innerText = '';
          document.getElementById('longitude')!.innerText = '';
          document.getElementById('latitude')!.innerText = '';
        });

      });
    }
  }
}