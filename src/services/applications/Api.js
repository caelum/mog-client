import {Course, CourseOptionDTO} from "../../domains";
import Mog from './Environment';

export default class Api {



    static fetchCourses(){
        return fetch(Mog.backendURL("/courses"))
                    .then( response => response.json())
                    .then( (values) => values.map( (json) => new Course(json) ) )
                    .then( (courses) => courses.map( (course) => new CourseOptionDTO(course) ) )
                    .catch(console.log("Não foi possível carregar os cursos"));
    }

    static downloadOffer(customer, responsibleName, caelumDistrict, coursesDTO){

        const courses = coursesDTO.map(dto => dto.toEntity());

        const payload = {   ...customer, ...responsibleName, ...caelumDistrict, courses };

        const headers = {'Content-Type': 'application/json'};
        const request = {method: 'post', body: JSON.stringify(payload), headers }

        fetch(Mog.backendURL("/offers"), request)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob) )
            .then(url => {
                let a = document.createElement("a");
                a.href = url;
                a.download = customer.commercialName + '.odt';
                a.click()
            });
    }


}