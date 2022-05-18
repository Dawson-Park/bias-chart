import styled from "styled-components";

const Container = styled("div")<{ width:string, height:string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  min-width: 300px;
  min-height: 300px;
  max-height: 750px;

  svg {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  g.tick text {
    font-size: 12px;
  }
  
  rect {
    transition: opacity ease .3s;
  }
  
  .tooltip {
    transition: all ease .2s;
  }
`;

export default Container;