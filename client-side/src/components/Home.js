import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            pictures : [],
            duplicate : [],
            pageCount : "",
            category : ""
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    Show = () =>{
        axios.post("http://127.0.0.1:5000/categoryFilter",{
            "clickVal" : 0,
            "category" : this.state.category
        }).then(res => {
            let l = res.data.page_count
            let count_page = Math.ceil(l/2)
            this.setState({
                duplicate : res.data.pictures,
                pageCount : count_page
            })
        }).catch(error => alert(error))
    }

    next = (i) =>{
        axios.post("http://127.0.0.1:5000/categoryFilter",{
            "clickVal" : i-1,
            "category" : this.state.category
        }).then(res => {
            this.setState({
                duplicate : res.data.pictures,
            })
        }).catch(error => alert(error))
    }

    Download = (i) =>{
        axios.put("http://127.0.0.1:5000/downloaded",{
            "upid" : i
        }).then(res => {
            if(res.data.message === "Downloaded"){
                swal(res.data.message,"welcome","success")
            }
        }).catch(error => alert(error))
    }

    render() {
        let pages = []
        for(let i = 0; i < this.state.pageCount; i++){
            pages.push(<li className="page-item"><a className="page-link" onClick={() => this.next(i+1)}>{i+1}</a></li>)
        }
        return (
            <div className="row container-fluid">
                <div className="col-md-2 mt-3">
                    <h1 className="m-2">Category</h1>
                    <div className="mx-3 mt-2">
                        <input type="radio" className="ml-1 mt-2" checked={this.state.category === "all"} onChange={this.handleChange} name="category" value="all" />
                        <label for="All">All</label><br />
                        <input type="radio" className="ml-1 mt-2" checked={this.state.category === "Technology"} onChange={this.handleChange} name="category" value="Technology" />
                        <label for="Technolgy">Technology</label><br />
                        <input type="radio" className="ml-1 mt-2" checked={this.state.category === "Marketing"} onChange={this.handleChange} name="category" value="Marketing" />
                        <label for="Markrting">Markrting</label><br />
                        <input type="radio" className="ml-1 mt-2" checked={this.state.category === "B2B"} onChange={this.handleChange} name="category" value="B2B" />
                        <label for="B2B">B2B</label><br />
                        <button className="btn mt-3 m-3 mb-3" style = {{backgroundColor : "#D5BC3C"}} onClick={this.Show}>Show</button>
                    </div>
                </div>
                <div className="col-md-10 mt-3">
                    <h1 className="text-center">Pictures</h1>
                    <div className="row ml-4 mt-4 justify-content-center">
                        {this.state.duplicate.map(ele =>
                            <div className="card ml-5" style={{width: "18rem"}}>
                                <img className="card-img-top" src={"images"+ele.image} alt="Card image cap" />
                                <div class="card-body">
                                    <p class="card-title">Contributor Name: {ele.name}</p>
                                    <p class="card-text">Image Name: {ele.iname}</p>
                                    <p class="card-text">Total Downloads: {ele.total_downloads}</p>
                                </div>
                                <button type="button" className="btn btn-outline-info" data-toggle="modal" data-target="#exampleModal" >More Info</button>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title text-primary" id="exampleModalLabel" >Image Info</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="card ml-5" style={{width: "15rem"}}>
                                                <img className="card-img-top" src={"images"+ele.image} alt="Card image cap" />
                                                <div class="card-body">
                                                    <p class="card-title">Contributor Name: {ele.name}</p>
                                                    <p class="card-text">Image Name: {ele.iname}</p>
                                                    <p class="card-text">Total Downloads: {ele.total_downloads}</p>
                                                </div>
                                                <button className="btn mt-3 mx-3 mb-3" style = {{backgroundColor : "#D5BC3C"}} onClick={() => this.Download(ele.upid)}>Download</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <br></br>
                    <div className="row justify-content-center">
                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                {pages}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
