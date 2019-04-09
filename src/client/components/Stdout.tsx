import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import styled from "styled-components";
import { themeGet } from "styled-system";
import { BgColor, FontSize, LineHeight } from "client/themes/constants";

interface StdoutProps {
  value: string;
}

export const Stdout: React.FC<StdoutProps> = ({ value }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [stickedToBottom, setStickedToBottom] = useState(true);

  useLayoutEffect(() => {
    const wrapperNode = wrapperRef.current;
    if (!wrapperNode) {
      return;
    }
    if (stickedToBottom) {
      wrapperNode.scrollTop = wrapperNode.scrollHeight;
    }
  }, [value, stickedToBottom]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      setStickedToBottom(true);
    } else {
      setStickedToBottom(false);
    }
  }, []);

  return (
    <StyledPreWrapper ref={wrapperRef} onScroll={handleScroll}>
      <StyledPre>{value}</StyledPre>
    </StyledPreWrapper>
  );
};

export const StyledPreWrapper = styled.div`
  max-width: 100%;
  overflow: auto;
  height: 80vh;
  border: 1px solid ${themeGet(`colors.${BgColor.Control}`)};
`;

export const StyledPre = styled.pre`
  font-size: ${themeGet(`fontSizes.${FontSize.S}`)}px;
  line-height: ${themeGet(`lineHeights.${LineHeight.SInset}`)}px;
`;
