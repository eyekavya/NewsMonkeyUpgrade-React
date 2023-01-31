import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 5,
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
    document.title = `${
      this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)
    } - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(20);
    const data = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
    );
    this.setState({
      loading: true,
    });
    let parsedData = await data.json();
    this.setState({ articles: parsedData.articles, loading: false });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    console.log(this.props);
    // let data = await fetch(
    //   `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=&page=1&pageSize=${this.props.pageSize}`
    // );
    // this.setState({
    //   loading: true,
    // });
    // let parsedData = await data.json();
    // this.setState({ articles: parsedData.articles, loading: false });
    this.updateNews();
  }

  // handlePrevClick = async () => {
  //   this.setState({
  //     page: this.state.page - 1,
  //   });
  //   this.updateNews();
  // };

  // handleNextClick = async () => {
  //   if (
  //     !(
  //       this.state.page + 1 >
  //       Math.ceil(this.state.totalResults / this.props.pageSize)
  //     )
  //   ) {
  //     this.setState({
  //       page: this.state.page + 1,
  //     });
  //     this.updateNews();
  //   }
  // };

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const data = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
    );

    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
    });
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0" }}>
          NewsMonkey - Top{" "}
          {this.props.category.charAt(0).toUpperCase() +
            this.props.category.slice(1)}{" "}
          Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {
                // !this.state.loading &&
                this.state.articles.map((e) => {
                  // a unique key is required in order to use map fn
                  return (
                    <div className="col-md-4" key={e.url}>
                      <NewsItem
                        title={e.title ? e.title.slice(0, 45) : ""}
                        description={
                          e.description ? e.description.slice(0, 88) : ""
                        }
                        imageUrl={e.urlToImage}
                        newsUrl={e.url}
                        author={e.author}
                        date={e.publishedAt}
                        source={e.source.name}
                      />
                    </div>
                  );
                })
              }
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div> */}
      </>
    );
  }
}

export default News;
