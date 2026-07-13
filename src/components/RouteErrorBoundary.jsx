import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class RouteErrorBoundary extends Component {
  constructor(props){
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(){
    return {hasError: true}
  }

  componentDidCatch(error, info){
    console.error('Route render failed', error, info)
  }

  componentDidUpdate(prevProps){
    if(prevProps.resetKey !== this.props.resetKey && this.state.hasError){
      this.setState({hasError: false})
    }
  }

  render(){
    if(this.state.hasError){
      return (
        <div className="card panel route-fallback" role="alert">
          <h2>Something went wrong loading this page.</h2>
          <p className="muted">The app shell is still running. Try returning to the dashboard or opening another section.</p>
          <Link className="btn btn-primary" to="/">Go to dashboard</Link>
        </div>
      )
    }

    return this.props.children
  }
}
