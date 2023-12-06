import React from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import Footer from "../components/Footer";
import { Content, Header } from "../components/text";
import { ContentBox, NarrowColumn } from "../components/layout";
import Gap from "../components/Gap";
import { useHistory } from "react-router-dom";
import StyledCheckboxComponent from "../components/Checkbox";
import styled from "styled-components";
import { largerThan } from "../utils/styledComponents";

const ENS_CONSTITUTION_SIGN_QUERY = gql`
  query privateRouteQuery @client {
    address
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  height: 160px;
  margin-bottom: 8px;

  ${largerThan.mobile`
    height: 400px;
    margin: 24px 0;
  `}
`;

const Tos = ({ location }) => {
  const { data } = useQuery(ENS_CONSTITUTION_SIGN_QUERY);
  const history = useHistory();

  return (
    <NarrowColumn>
      <ContentBox>
        <Header>Terms of Service</Header>
        <Gap height={2} />
        <Content>
          Please read and agree to the Terms of Service before delegating and
          claiming the airdrop.
        </Content>
        <Gap height={7} />
        <Container>
          <Content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Non arcu
            risus quis varius quam. Posuere urna nec tincidunt praesent semper
            feugiat. Viverra ipsum nunc aliquet bibendum. Mi sit amet mauris
            commodo quis imperdiet massa tincidunt. Cras adipiscing enim eu
            turpis egestas pretium aenean pharetra. Porta lorem mollis aliquam
            ut porttitor leo. Odio ut enim blandit volutpat maecenas volutpat.
            Ultrices dui sapien eget mi proin sed libero enim sed. Enim sit amet
            venenatis urna cursus eget nunc scelerisque viverra. Pharetra sit
            amet aliquam id diam maecenas ultricies. Sed egestas egestas
            fringilla phasellus faucibus scelerisque eleifend donec. Nibh
            venenatis cras sed felis eget velit aliquet sagittis. Ut faucibus
            pulvinar elementum integer enim neque volutpat ac. Augue mauris
            augue neque gravida in fermentum et sollicitudin. Integer vitae
            justo eget magna fermentum. Aliquet porttitor lacus luctus accumsan
            tortor posuere ac. Aliquet lectus proin nibh nisl condimentum id
            venenatis a. Sit amet purus gravida quis blandit turpis cursus. Nunc
            congue nisi vitae suscipit. Quam vulputate dignissim suspendisse in.
            Euismod nisi porta lorem mollis. Tempus imperdiet nulla malesuada
            pellentesque. Quam elementum pulvinar etiam non quam lacus
            suspendisse. Dui vivamus arcu felis bibendum ut tristique et egestas
            quis. Id nibh tortor id aliquet. Volutpat maecenas volutpat blandit
            aliquam etiam erat. Odio aenean sed adipiscing diam donec. Nulla
            facilisi etiam dignissim diam quis enim lobortis scelerisque
            fermentum. Quis commodo odio aenean sed adipiscing diam donec. In
            mollis nunc sed id semper. Massa tempor nec feugiat nisl pretium
            fusce id velit. At varius vel pharetra vel turpis nunc eget.
            Tristique sollicitudin nibh sit amet commodo nulla. Mollis nunc sed
            id semper risus in hendrerit gravida. Sagittis nisl rhoncus mattis
            rhoncus urna neque viverra justo. Nunc scelerisque viverra mauris
            in. Faucibus vitae aliquet nec ullamcorper. Consectetur lorem donec
            massa sapien faucibus et. Faucibus purus in massa tempor nec feugiat
            nisl pretium fusce. Aliquet sagittis id consectetur purus ut
            faucibus pulvinar elementum. Sem integer vitae justo eget magna
            fermentum iaculis. Quis risus sed vulputate odio ut enim blandit
            volutpat. Vestibulum sed arcu non odio euismod lacinia at quis
            risus. Tempor orci eu lobortis elementum nibh tellus molestie nunc
            non. Tellus in metus vulputate eu scelerisque felis imperdiet proin
            fermentum. Nulla facilisi etiam dignissim diam. Nec ultrices dui
            sapien eget mi proin sed libero. Venenatis urna cursus eget nunc
            scelerisque viverra mauris in. Sed egestas egestas fringilla
            phasellus faucibus scelerisque eleifend. Sit amet consectetur
            adipiscing elit duis. Rutrum quisque non tellus orci ac. Leo vel
            fringilla est ullamcorper eget nulla facilisi. Aliquam faucibus
            purus in massa tempor. Sapien eget mi proin sed libero enim sed
            faucibus turpis. Non pulvinar neque laoreet suspendisse interdum
            consectetur libero id faucibus. Venenatis tellus in metus vulputate
            eu scelerisque felis imperdiet. Nunc mi ipsum faucibus vitae aliquet
            nec ullamcorper. Faucibus scelerisque eleifend donec pretium
            vulputate sapien nec sagittis aliquam. Quis hendrerit dolor magna
            eget est lorem ipsum dolor. Sit amet mauris commodo quis imperdiet
            massa tincidunt nunc pulvinar. Luctus venenatis lectus magna
            fringilla urna porttitor rhoncus dolor. Id volutpat lacus laoreet
            non curabitur. Rhoncus mattis rhoncus urna neque viverra justo nec
            ultrices dui. Sed adipiscing diam donec adipiscing tristique risus
            nec feugiat in. Risus viverra adipiscing at in tellus integer
            feugiat scelerisque varius. Id consectetur purus ut faucibus
            pulvinar elementum integer. Id cursus metus aliquam eleifend mi in.
            Porta nibh venenatis cras sed felis eget velit. Faucibus nisl
            tincidunt eget nullam non. Eu augue ut lectus arcu bibendum at
            varius. Arcu dictum varius duis at consectetur lorem donec. Odio ut
            sem nulla pharetra diam sit amet. Phasellus vestibulum lorem sed
            risus ultricies tristique nulla aliquet. Fermentum odio eu feugiat
            pretium nibh ipsum consequat. Dolor sit amet consectetur adipiscing
            elit duis. Aliquam eleifend mi in nulla posuere sollicitudin. Nunc
            sed augue lacus viverra. Condimentum id venenatis a condimentum
            vitae sapien pellentesque habitant morbi. Tortor pretium viverra
            suspendisse potenti nullam. Eget duis at tellus at urna condimentum
            mattis. Vel facilisis volutpat est velit egestas dui id ornare arcu.
            Bibendum enim facilisis gravida neque convallis a cras semper
            auctor. Arcu ac tortor dignissim convallis aenean et tortor at
            risus. Morbi blandit cursus risus at ultrices mi tempus. Scelerisque
            eleifend donec pretium vulputate sapien nec. Nisl purus in mollis
            nunc sed id. Feugiat in ante metus dictum at tempor commodo
            ullamcorper a. In ornare quam viverra orci sagittis eu volutpat.
            Fermentum et sollicitudin ac orci. Sit amet consectetur adipiscing
            elit ut aliquam purus sit amet. Erat nam at lectus urna duis
            convallis convallis. Et malesuada fames ac turpis egestas maecenas
            pharetra convallis posuere. Consequat mauris nunc congue nisi vitae
            suscipit tellus. Turpis cursus in hac habitasse platea dictumst
            quisque sagittis. Sagittis eu volutpat odio facilisis mauris sit
            amet. Pellentesque adipiscing commodo elit at imperdiet dui
            accumsan. Ultricies mi quis hendrerit dolor magna eget est lorem
            ipsum. Eu nisl nunc mi ipsum faucibus vitae. Netus et malesuada
            fames ac turpis. Volutpat maecenas volutpat blandit aliquam. Feugiat
            pretium nibh ipsum consequat nisl vel. Scelerisque in dictum non
            consectetur a. Ornare massa eget egestas purus viverra. Morbi
            tristique senectus et netus et malesuada. Tincidunt augue interdum
            velit euismod. Vitae et leo duis ut diam quam nulla. Cras pulvinar
            mattis nunc sed blandit libero volutpat sed. Turpis nunc eget lorem
            dolor sed. Ullamcorper morbi tincidunt ornare massa. Augue ut lectus
            arcu bibendum at varius vel. Lectus vestibulum mattis ullamcorper
            velit sed. Turpis massa sed elementum tempus egestas sed sed.
            Eleifend quam adipiscing vitae proin sagittis. Est ultricies integer
            quis auctor elit sed vulputate mi. Eget gravida cum sociis natoque
            penatibus et. Blandit aliquam etiam erat velit scelerisque in.
            Varius vel pharetra vel turpis nunc eget lorem dolor sed. Gravida
            cum sociis natoque penatibus et magnis dis parturient. Fusce id
            velit ut tortor pretium viverra. Integer feugiat scelerisque varius
            morbi enim nunc faucibus. Quis viverra nibh cras pulvinar mattis
            nunc. Quis commodo odio aenean sed. Facilisis gravida neque
            convallis a cras semper auctor neque. Augue mauris augue neque
            gravida in fermentum et. Malesuada bibendum arcu vitae elementum
            curabitur vitae nunc sed. Aliquet sagittis id consectetur purus ut.
            Commodo elit at imperdiet dui accumsan. Hac habitasse platea
            dictumst vestibulum. At elementum eu facilisis sed odio morbi quis
            commodo odio. Turpis egestas maecenas pharetra convallis posuere
            morbi. Sed felis eget velit aliquet sagittis. Consequat ac felis
            donec et odio. Suspendisse interdum consectetur libero id faucibus
            nisl tincidunt. Eget lorem dolor sed viverra ipsum nunc aliquet
            bibendum. Amet porttitor eget dolor morbi. Orci porta non pulvinar
            neque laoreet. Phasellus vestibulum lorem sed risus ultricies
            tristique. Sed enim ut sem viverra aliquet. Imperdiet sed euismod
            nisi porta lorem mollis aliquam. Bibendum est ultricies integer quis
            auctor elit sed vulputate. Ipsum suspendisse ultrices gravida dictum
            fusce ut placerat orci. Sem nulla pharetra diam sit amet nisl
            suscipit. Sollicitudin ac orci phasellus egestas tellus rutrum
            tellus pellentesque. Dis parturient montes nascetur ridiculus. Risus
            sed vulputate odio ut enim blandit.
          </Content>
        </Container>
        <StyledCheckboxComponent />
      </ContentBox>
      <Footer
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/governance");
        }}
        rightButtonText="Confirm"
        rightButtonCallback={() => {
          history.push("/delegate-ranking");
        }}
        disabled={false}
      />
    </NarrowColumn>
  );
};

export default Tos;
