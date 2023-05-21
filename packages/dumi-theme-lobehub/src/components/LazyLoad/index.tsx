// copy form https://github.com/loktar00/react-lazy-load/blob/master/src/LazyLoad.tsx#L2
import { Card } from 'antd';
import React, { Children, Component, createElement, ReactNode, RefObject } from 'react';
import scrollParent from './utils';

type Props = {
  children: ReactNode;
  className?: string;
  elementType?: string;
  height?: string | number;
  offset?: string | number;
  threshold?: number;
  width?: number | string;
  onContentVisible?: () => void;
};

type State = {
  visible: boolean;
};

export class IntersectionLoad extends Component<Props, State> {
  static defaultProps = {
    elementType: 'div',
    className: '',
    offset: 0,
    threshold: 0,
    width: null,
    onContentVisible: null,
    height: null,
  };

  elementObserver: IntersectionObserver | null;

  wrapper: RefObject<HTMLElement> | null;

  constructor(props: Props) {
    super(props);
    this.elementObserver = null;
    this.wrapper = React.createRef();

    this.state = { visible: false };
  }

  componentDidMount() {
    let eventNode = this.getEventNode();

    if (eventNode === window) {
      eventNode = document.body;
    }

    setTimeout(() => {
      const { offset, threshold } = this.props;
      const options = {
        rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
        threshold: threshold || 0,

        root: document.body,
      };

      this.elementObserver = new IntersectionObserver(this.lazyLoadHandler, options);

      const node = this.wrapper?.current;

      if (node instanceof HTMLElement) {
        this.elementObserver.observe(node);
      }
    }, 200);
  }

  shouldComponentUpdate(_: Props, nextState: State) {
    return nextState.visible;
  }

  componentWillUnmount() {
    const node = this.wrapper?.current;
    console.log(node);
    if (node && node instanceof HTMLElement) {
      this.elementObserver?.unobserve(node);
    }
  }

  getEventNode() {
    if (!this.wrapper?.current) return document.body;
    return scrollParent(this.wrapper?.current);
  }

  lazyLoadHandler = (entries: IntersectionObserverEntry[]) => {
    const { onContentVisible } = this.props;
    const [entry] = entries;
    const { isIntersecting } = entry;

    if (isIntersecting) {
      this.setState({ visible: true }, () => {
        if (onContentVisible) {
          onContentVisible();
        }
      });

      // Stop observing
      const node = this.wrapper?.current;
      if (node && node instanceof HTMLElement) {
        this.elementObserver?.unobserve(node);
      }
    }
  };

  render() {
    const { children, className, height, width, elementType } = this.props;
    const { visible } = this.state;

    const elStyles = { width };
    const elClasses = `LazyLoad${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`;

    const componentElementType = elementType || 'div';

    return createElement(
      componentElementType,
      {
        className: elClasses,
        style: elStyles,
        ref: this.wrapper,
      },
      visible ? (
        Children.only(children)
      ) : (
        <Card
          className="loading"
          loading
          style={{
            height,
            width: '100%',
          }}
        />
      ),
    );
  }
}
