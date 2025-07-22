import { NavigationDrawerItemForObjectMetadataItem } from '@/object-metadata/components/NavigationDrawerItemForObjectMetadataItem';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { getObjectPermissionsForObject } from '@/object-metadata/utils/getObjectPermissionsForObject';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerItemsCollapsableContainer } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItemsCollapsableContainer';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useIcons } from 'twenty-ui/display';

const ORDERED_STANDARD_OBJECTS = [
  'person',
  'company',
  'opportunity',
  'task',
  'note',
];

export const NavigationDrawerSectionForObjectMetadataItems = ({
  sectionTitle,
  isRemote,
  objectMetadataItems,
}: {
  sectionTitle: string;
  isRemote: boolean;
  objectMetadataItems: ObjectMetadataItem[];
}) => {
  const { toggleNavigationSection, isNavigationSectionOpenState } =
    useNavigationSection('Objects' + (isRemote ? 'Remote' : 'Workspace'));
  const isNavigationSectionOpen = useRecoilValue(isNavigationSectionOpenState);

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();

  const sortedStandardObjectMetadataItems = [...objectMetadataItems]
    .filter((item) => ORDERED_STANDARD_OBJECTS.includes(item.nameSingular))
    .sort((objectMetadataItemA, objectMetadataItemB) => {
      const indexA = ORDERED_STANDARD_OBJECTS.indexOf(
        objectMetadataItemA.nameSingular,
      );
      const indexB = ORDERED_STANDARD_OBJECTS.indexOf(
        objectMetadataItemB.nameSingular,
      );
      if (indexA === -1 || indexB === -1) {
        return objectMetadataItemA.nameSingular.localeCompare(
          objectMetadataItemB.nameSingular,
        );
      }
      return indexA - indexB;
    });

  const sortedCustomObjectMetadataItems = [...objectMetadataItems]
    .filter((item) => !ORDERED_STANDARD_OBJECTS.includes(item.nameSingular))
    .sort((objectMetadataItemA, objectMetadataItemB) => {
      return new Date(objectMetadataItemA.createdAt) <
        new Date(objectMetadataItemB.createdAt)
        ? 1
        : -1;
    });

  const objectMetadataItemsForNavigationItems = [
    ...sortedStandardObjectMetadataItems,
    ...sortedCustomObjectMetadataItems,
  ];

  const objectMetadataItemsForNavigationItemsWithReadPermission =
    objectMetadataItemsForNavigationItems.filter(
      (objectMetadataItem) =>
        getObjectPermissionsForObject(
          objectPermissionsByObjectMetadataId,
          objectMetadataItem.id,
        ).canReadObjectRecords,
    );
  const { getIcon } = useIcons();
  const currentPath = useLocation().pathname;
  const isActive = currentPath === '/object/workspace-data';

  return (
    objectMetadataItems.length > 0 && (
      <NavigationDrawerSection>
        <NavigationDrawerAnimatedCollapseWrapper>
          <NavigationDrawerSectionTitle
            label={sectionTitle}
            onClick={() => toggleNavigationSection()}
          />
        </NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerItemsCollapsableContainer isGroup={false}>
          <NavigationDrawerItem
            key={'teste'}
            label={'Dados do Workspace'}
            to={'/object/workspace-data'}
            Icon={getIcon('IconUser')}
            active={isActive}
          />
        </NavigationDrawerItemsCollapsableContainer>

        {isNavigationSectionOpen &&
          objectMetadataItemsForNavigationItemsWithReadPermission.map(
            (objectMetadataItem) => (
              <div>
                <NavigationDrawerItemForObjectMetadataItem
                  key={`navigation-drawer-item-${objectMetadataItem.id}`}
                  objectMetadataItem={objectMetadataItem}
                />
              </div>
            ),
          )}
      </NavigationDrawerSection>
    )
  );
};
