import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceMembersState } from '@/auth/states/currentWorkspaceMembersStates';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useGetRolesQuery } from '~/generated-metadata/graphql';

export const WorkspaceData = () => {
  const theme = useTheme();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const currentWorkspaceMembers = useRecoilValue(currentWorkspaceMembersState);
  const { data: rolesData } = useGetRolesQuery();

  // const { records: workspaceMembers } = useFindManyRecords<WorkspaceMember>({
  //   objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
  // });

  const StyledDadosDoWorkspace = styled.div`
    background-color: ${theme.background.primary};
    color: ${theme.font.color.primary};
    width: 100%;
    padding: 20px;
    border-radius: 5px;
    overflow: auto;
    height: 100vh;
  `;

  const StyledWorkspaceTitle = styled.h2`
    background-color: ${theme.background.tertiary};
    font-size: 1.5em;
    padding: 10px;
    margin: 0;
    margin-top: 20px;
  `;

  const StyledInputContainer = styled.div`
    background-color: ${theme.background.quaternary};

    div {
      display: flex;
    }
  `;

  const StyledBox = styled.div`
    gap: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    label {
      color: ${theme.font.color.primary};
    }

    input {
      background-color: ${theme.background.secondary};
      color: orangered;
      border: 1px solid ${theme.border.color.strong};
      padding: 8px;
      border-radius: 3px;
      font-size: 1.1em;
    }
  `;

  const StyledUserTable = styled.table`
    border-collapse: collapse;
    width: 100%;
  `;

  const StyledTableHead = styled.thead`
    background-color: ${theme.background.tertiary};
    font-size: 0.9em;
    text-align: left;
  `;

  const StyledTableHeader = styled.th`
    padding: 10px;
  `;

  const StyledTableBody = styled.tbody`
    color: ${theme.font.color.primary};
  `;

  const StyledTableRow = styled.tr`
    &:nth-child(even) {
      background-color: ${theme.background.tertiary};
    }
  `;

  const StyledTableCell = styled.td`
    padding: 10px;
  `;

  return (
    <StyledDadosDoWorkspace>
      <StyledInputContainer>
        {/* <pre>{JSON.stringify(currentWorkspaceMembers, null, 2)}</pre> */}
        <StyledWorkspaceTitle>Dados do WorkSpace</StyledWorkspaceTitle>
        <div>
          <StyledBox>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              value={currentWorkspace?.displayName || ''}
              readOnly
            />
          </StyledBox>
          <StyledBox>
            <label htmlFor="quantidade">Quantidade de Usuários</label>
            <input
              type="number"
              id="quantidade"
              value={currentWorkspaceMembers.length}
              readOnly
            />
          </StyledBox>
        </div>
      </StyledInputContainer>
      <StyledInputContainer>
        <StyledWorkspaceTitle>Lista de Usuarios</StyledWorkspaceTitle>
        <StyledUserTable>
          <StyledTableHead>
            <tr>
              <StyledTableHeader>Nome</StyledTableHeader>
              <StyledTableHeader>Função</StyledTableHeader>
              <StyledTableHeader>Email</StyledTableHeader>
              <StyledTableHeader>Status</StyledTableHeader>
            </tr>
          </StyledTableHead>
          <StyledTableBody>
            {currentWorkspaceMembers.map((user, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  {user.name.firstName} {user.name.lastName}
                </StyledTableCell>
                <StyledTableCell>
                  {rolesData?.getRoles.map((role) => {
                    if (
                      role.workspaceMembers.find(
                        (member) => member.id === user.id,
                      ) !== undefined
                    ) {
                      return role.label;
                    }
                    return null;
                  })}
                </StyledTableCell>
                <StyledTableCell>{user.userEmail}</StyledTableCell>
                <StyledTableCell>Ativo</StyledTableCell>
              </StyledTableRow>
            ))}
          </StyledTableBody>
        </StyledUserTable>
      </StyledInputContainer>
    </StyledDadosDoWorkspace>
  );
};
