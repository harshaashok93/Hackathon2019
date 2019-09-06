/* @flow weak */

/*
 * Component: DumbledoreLintContainer
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// External Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import React, { Component } from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Internal Dependencies
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import './DumbledoreLintContainer.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Component Definition
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function renderLogo() {
  return (
    <div className="dumbledore-lint-container--header">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 197 55">
        <path id="Fill-L" fill="#FFFFFF" d="M119.5,0.2h8.9V41h22.6l-4.4,8.9h-27.1V0.2" />
        <path id="Fill-E" fill="#FFFFFF" d="M174.4,29.5h15.1l4.2-8.8h-19.2V9.1H197V0.2h-31.5v49.7H197V41h-22.6V29.5" />
        <path id="Fill-A" fill="#FFFFFF" d="M65.6,49.9h-9.9L80.2,0.2l24.4,49.6h-9.8L80.2,19.1L65.6,49.9" />
        <path
          id="Fill-G"
          fill="#FFFFFF"
          d="M36,13.6c-1.4-1.3-3-2.4-4.8-3.2c-1.9-0.8-4.1-1.3-6.3-1.3c-2.2,0-4.3,0.4-6.2,1.2
            c-1.9,0.8-3.6,2-5.1,3.4c-1.5,1.5-2.6,3.2-3.5,5.1c-0.8,1.9-1.2,4-1.2,6.2c0,2.2,0.4,4.3,1.2,6.3c0.8,1.9,2,3.6,3.5,5.1
            c1.5,1.4,3.2,2.6,5.1,3.4c1.9,0.8,4,1.2,6.2,1.2c3.3,0,6.3-0.9,8.8-2.6v-8.9h-14l4.2-8.8h18.7v21.8c-1.2,1.2-2.6,2.3-4.1,3.3
            c-1.5,1-3.1,1.8-4.8,2.5c-2.8,1.1-5.7,1.6-8.8,1.6c-3.4,0-6.6-0.7-9.7-2c-3-1.3-5.7-3.1-7.9-5.3c-2.3-2.2-4-4.9-5.3-7.9
            c-1.3-3-2-6.3-2-9.7c0-3.4,0.7-6.6,2-9.7c1.3-3,3.1-5.7,5.3-7.9c2.3-2.3,4.9-4,7.9-5.3c3-1.3,6.3-2,9.7-2c3.5,0,6.8,0.7,9.8,2
            C36.6,3,38.4,4.1,40,5.3L36,13.6"
        />
      </svg>
    </div>
  );
}

class DumbledoreLintContainer extends Component {
  props: {
    errors: string[],
  };

  state = {
    image: '',
  };

  getGiphy() {
    const terms = ['keyboard', 'hacker', 'programming', 'error', 'dumbledore'];
    const query = terms[Math.floor(Math.random() * terms.length)];
    const offset = Math.floor(Math.random() * 10);
    const url = `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=dc6zaTOxFJmzC&limit=1&offset=${offset}&rating=pg`;

    fetch(url)
      .then(response => response.json())
      .then(json => {
        const image = json.data[0].images.fixed_height.url;

        if (image) {
          this.setState({ image });
        }
      });
  }

  constructor(props) {
    super(props);

    this.getGiphy();
  }

  render() {
    return (
      <div className="dumbledore-lint-container">
        {renderLogo()}

        <div className="dumbledore-lint-container--error-container">
          <img src={this.state.image} alt="" />
          <div className="dumbledore-lint-container--title">
            Dumbledore Lint detected an error with the codebase. Please see the error logs below to determine the source of the issue. You will need to fix these problems before the build can proceed.
          </div>

          {this.props.errors.map(e => (
            <div className="dumbledore-lint-container--files" key={e.filePath}>
              <div className="dumbledore-lint-container--file-path">
                {e.filePath.replace(/.+?(?=client)/, '<PROJECT_ROOT>/')}:
              </div>
              {e.messages.map(m => (
                <div className="dumbledore-lint-container--errors" key={`${m.line}-${m.column}`}>
                  <div>{m.message}</div>
                  <div>
                    [{m.line}: {m.column}]{'  '}
                    <span className="dumbledore-lint-container--source">{m.source}</span>
                  </div>
                  <div>
                    <a href={`http://eslint.org/docs/rules/${m.ruleId}`}>
                      {`http://eslint.org/docs/rules/${m.ruleId}`}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    );
  }
}

export default DumbledoreLintContainer;
