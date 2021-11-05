import styled from "styled-components";
import { Header } from "../../components/text";
import { getConstitution } from "./constitutionHelpers";
import theme from "../../components/theme";

const SectionHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StepsContainer = styled.div`
  display: flex;
`;

const Step = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: ${(p) => {
    if (p.currentStep) return `#878787`;
    if (p.vote === true) return theme.colors.green;
    if (p.vote === false) return theme.colors.red;
    return `#DDDDDD`;
  }};

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const titleCopy = (currentStep, length) => {
  switch (currentStep) {
    case -1:
      return "Constitution";
    case 0:
      return `Article I`;
    case 1:
      return `Article II`;
    case 2:
      return `Article III`;
    case 3:
      return `Article IV`;
    case 4:
      return `Your votes`;
    default:
      return "Constitution";
  }
};

const SectionHeader = ({ account, currentStep, setCurrentStep }) => {
  const constitution = getConstitution(account);
  return (
    <SectionHeaderContainer>
      <Header>{titleCopy(currentStep, constitution?.length)}</Header>
      <StepsContainer>
        {constitution.map((article, idx) => {
          return (
            <Step
              onClick={() => setCurrentStep(idx)}
              currentStep={currentStep === idx}
              vote={article.vote}
            />
          );
        })}
      </StepsContainer>
    </SectionHeaderContainer>
  );
};

export default SectionHeader;
