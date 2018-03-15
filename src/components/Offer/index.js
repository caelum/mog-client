import React, {Component} from 'react';
import {Form, Button, Divider, Search} from 'semantic-ui-react'
import customStyle from './proposta.css'
import {Api} from '../../services'
import SelectedCourses from '../SelectedCourses'
import {Customer} from '../../domains';

class Offer extends Component {

    defaultOptions = [];

    state = {
        businessName: '',
        commercialName: '',
        cnpj: '',
        selectedCourses: [],
    };


    handleChange = (event, {name, value}) => this.setState({[name]: value});

    handleSubmit = () => {

        const {selectedCourses, businessName, commercialName, cnpj} = this.state;

        Api.downloadOffer(new Customer(businessName, commercialName, cnpj), selectedCourses);

    };

    resultRender = (option) => {
        const {course} = option;

        return <div key={course.code} className={customStyle.course_result}>{course.name}</div>
    } ;

    resetSearch = () => this.setState({isLoading: false, results: [], value: ''});

    handleResultSelect = (e, {result}) => {
        this.resetSearch();
        let {selectedCourses} = this.state;

        if (selectedCourses.includes(result)) {
            return
        }

        selectedCourses.push(result);


        this.setState({selectedCourses});
    };

    reorder = (list, startIndex, endIndex) => {

        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        this.setState({selectedCourses: result});
    };

    handleSearchCourse = (event, {value}) => {
        this.setState({isLoading: true, value});

        setTimeout(() => {

            if (this.state.value.length < 1) return this.resetSearch();

            let results = [];
            let search = value.toLowerCase();

            this.defaultOptions
                .filter((o) => o.value.toLowerCase().includes(search) || o.text.toLowerCase().includes(search))
                .forEach((o) => results.push(o));

            this.setState({isLoading: false, results})

        }, 500);


    };

    removeSelectedCourse = (event, course) => {
        let {selectedCourses} = this.state;

        const index = selectedCourses.indexOf(course);

        selectedCourses.splice(index, 1);

        this.setState({selectedCourses});

    };

    componentWillMount() {
        Api.fetchCourses()
            .then( (options) => { this.defaultOptions = options } );

        this.resetSearch();
    };


    render() {

        const {businessName,commercialName, cnpj, isLoading, results, value, selectedCourses} = this.state;
        const disableSubmmit = selectedCourses.length === 0;
        return (
            <div className={customStyle.content}>


                <h1>Cadastro de propostas</h1>


                <Divider horizontal>Dados do cliente</Divider>
                <Form onSubmit={this.handleSubmit}>

                    <Form.Field>
                        <Form.Input label="Razão Social" name="businessName" placeholder="Empresa LTDA"
                                    content={businessName} onChange={this.handleChange} required/>
                    </Form.Field>

                    <Form.Field>
                        <Form.Input label="Nome Santasia" name="commercialName" placeholder="Empresa"
                                    content={commercialName} onChange={this.handleChange} required/>
                    </Form.Field>

                    <Form.Field>
                        <Form.Input label="CNPJ" name="cnpj" placeholder="11.111.111/1111-11"
                                    content={cnpj} onChange={this.handleChange} required/>
                    </Form.Field>


                    <Divider horizontal>Cursos</Divider>

                    <Form.Field>
                        <Search
                            minCharacters={2} loading={isLoading}
                            placeholder="FJ-11"
                            results={results}
                            value={value}
                            resultRenderer={this.resultRender}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={this.handleSearchCourse}
                        />
                    </Form.Field>

                    <SelectedCourses reorder={this.reorder} selectedCourses={selectedCourses} removeSelectedCourse={this.removeSelectedCourse}/>

                    <Button type='submit' disabled={disableSubmmit}>Gerar Proposta</Button>

                </Form>
            </div>
        );
    }
}

export default Offer;