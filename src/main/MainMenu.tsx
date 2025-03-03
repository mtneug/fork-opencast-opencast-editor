import React from "react";

import { css } from '@emotion/react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut, faFilm, faListUl, faPhotoVideo, faSignOutAlt, faKeyboard, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from 'react-redux'
import { setState, selectMainMenuState, mainMenu } from '../redux/mainMenuSlice'
import { setPageNumber } from '../redux/finishSlice'

import { MainMenuStateNames } from '../types'
import { settings } from '../config'
import { basicButtonStyle, flexGapReplacementStyle } from '../cssStyles'
import { setIsPlaying } from "../redux/videoSlice";

import './../i18n/config';
import { useTranslation } from 'react-i18next';
import { resetPostRequestState as metadataResetPostRequestState } from "../redux/metadataSlice";
import { resetPostRequestState } from "../redux/workflowPostSlice";

/**
 * A container for selecting the functionality shown in the main part of the app
 */
const MainMenu: React.FC<{}> = () => {

  const { t } = useTranslation();

  const mainMenuStyle = css({
    borderRight: '1px solid #BBB',
    width: '100px',
    display: 'flex',
    flexDirection: 'column' as const,
    flexShrink: 0,
    alignItems: 'center',
    padding: '20px',
    height: '100%',
    position: 'fixed',
    overflow: 'auto',
    ...(flexGapReplacementStyle(30, false)),
  });

  return (
    <nav css={mainMenuStyle} role="navigation" aria-label={t("mainMenu.tooltip-aria")}>
      <MainMenuButton
        iconName={faCut}
        stateName={MainMenuStateNames.cutting}
        bottomText={t(MainMenuStateNames.cutting)}
        ariaLabelText={t(MainMenuStateNames.cutting)}
      />
      {settings.metadata.show && <MainMenuButton
        iconName={faListUl}
        stateName={MainMenuStateNames.metadata}
        bottomText={t(MainMenuStateNames.metadata)}
        ariaLabelText={t(MainMenuStateNames.metadata)}
      />}
      {settings.trackSelection.show && <MainMenuButton
      iconName={faFilm}
      stateName={MainMenuStateNames.trackSelection}
      bottomText={t(MainMenuStateNames.trackSelection)}
      ariaLabelText={t(MainMenuStateNames.trackSelection)}
      />}
      {settings.thumbnail.show && <MainMenuButton
      iconName={faPhotoVideo}
      stateName={MainMenuStateNames.thumbnail}
      bottomText={t(MainMenuStateNames.thumbnail)}
      ariaLabelText={t(MainMenuStateNames.thumbnail)}
      />}
      <MainMenuButton
        iconName={faSignOutAlt}
        stateName={MainMenuStateNames.finish}
        bottomText={t(MainMenuStateNames.finish)}
        ariaLabelText={t(MainMenuStateNames.finish)}
      />
      {/* A space for buttons that would normally go in a header or footer */}
      <div css={{flexGrow: 99, display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
        <MainMenuButton
          iconName={faKeyboard}
          stateName={MainMenuStateNames.keyboardControls}
          bottomText={""}
          ariaLabelText={t("keyboardControls.header")}
          miniButton={true}
        />
      </div>
    </nav>
  );
};

interface mainMenuButtonInterface {
  iconName: IconDefinition,
  stateName: mainMenu["value"],
  bottomText: string,
  ariaLabelText: string;
  miniButton?: boolean,
}

/**
 * A button to set the state of the app
 * @param param0
 */
const MainMenuButton: React.FC<mainMenuButtonInterface> = ({iconName, stateName, bottomText, ariaLabelText, miniButton = false}) => {

  const dispatch = useDispatch();
  const activeState = useSelector(selectMainMenuState)

  const onMenuItemClicked = () => {
    dispatch(setState(stateName));
    // Reset multi-page content to their first page
    if (stateName === MainMenuStateNames.finish) {
      dispatch(setPageNumber(0))
    }
    // Halt ongoing events
    dispatch(setIsPlaying(false))
    // Reset states
    dispatch(resetPostRequestState())
    dispatch(metadataResetPostRequestState())
  }

  const buttonStyle = () => {
    if (!miniButton) {
      return mainMenuButtonStyle
    } else {
      return miniMenuButtonStyle
    }
  }

  const mainMenuButtonStyle = css({
    width: '100%',
    height: '100px',
    ...(activeState === stateName) && {
      backgroundColor: '#DDD',
    },
    flexDirection: 'column' as const,
  });

  const miniMenuButtonStyle = css({
    width: '75px',
    height: '67px',
    marginBottom: '35px',
    ...(activeState === stateName) && {
      backgroundColor: '#DDD',
    },
    flexDirection: 'column' as const,
  });

  return (
    <li css={[basicButtonStyle, buttonStyle()]}
      role="menuitem" tabIndex={0}
      aria-label={ariaLabelText}
      onClick={ onMenuItemClicked }
      onKeyDown={(event: React.KeyboardEvent<HTMLLIElement>) => { if (event.key === "Enter") {
        onMenuItemClicked()
      }}}
      >
      <FontAwesomeIcon icon={iconName} size={miniButton ? "1x" : "2x"}/>
      {bottomText && <div>{bottomText}</div>}
    </li>
  );
};

export default MainMenu;
