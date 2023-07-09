import React, { Component } from 'react';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import { ThreeDots } from 'react-loader-spinner';
import styles from './ImageGallery.module.css';

export default class ImageGallery extends Component {
  state = {
    photos: [],
    error: null,
    status: 'idle',
    photosPerPage: 20,
  };
  handleIncreament = () => {
    this.setState({ photosPerPage: this.state.photosPerPage + 20 })
  }
  componentDidUpdate = prevProps => {
    if (prevProps.query !== this.props.query) {
      this.setState({ status: 'pending' });
      fetch(
        `https://pixabay.com/api/?q=${this.props.query}&page=1&key=35594812-0318ae570b601c4a3427f19fb&image_type=photo&orientation=horizontal&per_page=200`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error('Images not found'));
        })
        .then(photos => {
          this.setState({
            photos: photos.hits,
            status: 'resolved',
            error: false,
          });
        })
        .catch(error =>
          this.setState({ error: error.message, status: 'rejected' })
        );
    }
  };
  render() {
    const { photos, error, status, photosPerPage } = this.state;
    if (status === 'pending') {
      return (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#000"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      );
    }

    if (status === 'rejected') {
      return <p>{error}</p>;
    }

    if (status === 'resolved') {
      return (
        <>
        <ul className={styles.ImageGallery}>
          {photos.length > 0 ? (
            photos.slice(0, photosPerPage).map(({ id, webformatURL, tags }) => (
              <ImageGalleryItem
                key={id}
                imageLink={webformatURL}
                imageTags={tags}
              />
            ))
          ) : (
            <p>Nothing here...</p>
          )}
        </ul>
        <button className={styles.Button} type="button" onClick={this.handleIncreament}>Load more</button>
        </>
      );
    }
  }
}