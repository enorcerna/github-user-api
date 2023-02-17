import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../contexts/ThemeContext";
import Logo from "../icons/Logo";
import { TopAreaProps, UserProps } from "../types/index";
import { joinedDate } from "../utils/formatter";

export function TopArea({ setUser }: TopAreaProps) {
  const { changeTheme, lightMode } = useContext(ThemeContext);
  const [empty, setEmpty] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [inputUser] = useState("octocat");

  function hadleSubmit() {
    if (
      usernameRef.current?.value.trim() === "" ||
      usernameRef.current?.value === undefined
    ) {
      setEmpty(true);
      setUser(null);
      return;
    }
    setEmpty(false);
    fetchUser(usernameRef.current.value);
  }

  async function fetchUser(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    if (response.status != 200) {
      setNotFound(true);
      setUser(null);
      return;
    }
    setNotFound(false);

    console.log(data);

    const user: UserProps = {
      pfp: data.avatar_url,
      name: data.name,
      joinedAt: joinedDate(data.created_at),
      username: data.login,
      bio: data.bio,
      repos: data.plublic_repos,
      followers: data.followers,
      following: data.following,
      links: {
        location: data.location,
        twitter: data.twitter_username,
        company: data.company,
        blog: data.blog,
      },
    };
    setUser(user);
  }
  useEffect(() => {
    fetchUser(inputUser);
  }, [inputUser]);

  return (
    <Container>
      <ThemeArea>
        <Logo Fill={lightMode ? "#222731" : "#fff"} />
        <ChangeThemeBtn type="button" onClick={changeTheme}>
          {lightMode ? (
            <>
              Dark
              <img src="/assets/iconDark.svg" alt="dark mode" />
            </>
          ) : (
            <>
              Light
              <img src="/assets/iconLight.svg" alt="light mode" />
            </>
          )}
        </ChangeThemeBtn>
      </ThemeArea>
      <InputArea
        onSubmit={(e) => {
          e.preventDefault();
          hadleSubmit();
        }}
      >
        <InputLabel>
          <img src="/assets/iconSearch.svg" alt="Search .." />
        </InputLabel>
        <Input
          ref={usernameRef}
          name="username"
          id="username"
          type="text"
          placeholder="Search username ..."
        />
        {empty && <Warn>Enter User</Warn>}
        {notFound && <Warn>Not Found</Warn>}
        <SubmitBtn type="submit">Search</SubmitBtn>
      </InputArea>
    </Container>
  );
}

const Container = styled.header`
  width: 100%;
  max-width: 73.3rem;
`;

const ThemeArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ChangeThemeBtn = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
  font-weight: bold;
  font-size: 1.6rem;
  line-height: 1.9rem;
  letter-spacing: 0.25rem;
  color: ${(props) => props.theme.colors.themeBtn};

  cursor: pointer;
  img {
    margin-left: 1.6rem;
    fill: ${(props) => props.theme.colors.themeBtn};
  }
`;
const InputArea = styled.form`
  margin-top: 3.6rem;
  border-radius: 1.5rem;
  background: ${(props) => props.theme.colors.card};
  box-shadow: 0px 16px 30px -10px rgba(70, 96, 187, 0.198567);
  width: 100%;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.7rem 0.7rem 1.6rem;
  transition: height 0.3s ease;
  position: relative;
  @media (min-width: 768px) {
    height: 6.9rem;
  }
`;
const InputLabel = styled.label`
  height: 2.4rem;
  cursor: pointer;
`;
const Input = styled.input`
  flex: 1;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 192%;
  color: ${(props) => props.theme.colors.textNorm};
  background: none;
  border: none;
  margin: 0 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.7rem;
    margin: 0 2.4rem;
  }
  &:focus {
    outline: 1px dashed #0079ff;
  }
`;
const SubmitBtn = styled.button`
  background: #0079ff;
  border: none;
  height: 100%;
  border-radius: 1rem;
  line-height: 2.1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  width: 8.4rem;
  transition: all 0.3s ease-out;
  &::hover {
    filter: brightness(0.05);
    box-shadow: 0px 0px 15px -3px #0079ff;
  }
  @media (min-width: 768px) {
    width: 10.6rem;
    font-size: 1.7rem;
  }
`;
const Warn = styled.small`
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 2.2rem;
  color: #f74646;
  margin-right: 3.4rem;
`;
