import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // document.title = `${
  //   props.category.charAt(0).toUpperCase() + props.category.slice(1)
  // } - NewsMonkey`;

  const updateNews = async () => {
    props.setProgress(20);
    const data = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
    );
    setLoading(true);

    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    updateNews();
  }, []);

  // const handlePrevClick = async () => {
  //   setPage(page-1)

  //   updateNews();
  // };

  // const handleNextClick = async () => {
  //   if (
  //     !(
  //       page + 1 >
  //       Math.ceil(totalResults / props.pageSize)
  //     )
  //   ) {
  //     setPage(page+1)

  //     updateNews();
  //   }
  // };

  const fetchMoreData = async () => {
    setPage(page + 1);
    const data = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${
        props.category
      }&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
    );

    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "90px 0 35px 0" }}>
        NewsMonkey - Top{" "}
        {props.category.charAt(0).toUpperCase() + props.category.slice(1)}{" "}
        Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {
              // !this.state.loading &&
              articles.map((e) => {
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
              Math.ceil(this.state.totalResults / props.pageSize)
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
};

News.defaultProps = {
  country: "in",
  pageSize: 5,
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
};

export default News;
