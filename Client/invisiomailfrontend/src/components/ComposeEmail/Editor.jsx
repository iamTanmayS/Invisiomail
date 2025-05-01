import { Box, Button, Stack, TextField } from "@mui/material";
import {
    LinkBubbleMenu,
    MenuButton,
    RichTextEditor,
    TableBubbleMenu,
    insertImages,
} from "mui-tiptap";
import { Lock, LockOpen, TextFields } from "@mui/icons-material";
import { useCallback, useRef, useState } from "react";

import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./useExtensions";

function fileListToImageFiles(fileList) {
    return Array.from(fileList).filter((file) => {
        const mimeType = (file.type || "").toLowerCase();
        return mimeType.startsWith("image/");
    });
}

export default function Editor() {
    const extensions = useExtensions({
        placeholder: "Write your email here...",
    });
    const rteRef = useRef(null);
    const [isEditable, setIsEditable] = useState(true);
    const [showMenuBar, setShowMenuBar] = useState(true);
    const [emailData, setEmailData] = useState({
        to: '',
        subject: ''
    });

    const handleEmailDataChange = (field) => (event) => {
        setEmailData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleNewImageFiles = useCallback(
        (files, insertPosition) => {
            if (!rteRef.current?.editor) {
                return;
            }

            const attributesForImageFiles = files.map((file) => ({
                src: URL.createObjectURL(file),
                alt: file.name,
            }));

            insertImages({
                images: attributesForImageFiles,
                editor: rteRef.current.editor,
                insertPosition,
            });
        },
        [],
    );

    const handleDrop = useCallback(
        (view, event, _slice, _moved) => {
            if (!(event instanceof DragEvent) || !event.dataTransfer) {
                return false;
            }

            const imageFiles = fileListToImageFiles(event.dataTransfer.files);
            if (imageFiles.length > 0) {
                const insertPosition = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                })?.pos;

                handleNewImageFiles(imageFiles, insertPosition);
                event.preventDefault();
                return true;
            }

            return false;
        },
        [handleNewImageFiles],
    );

    const handlePaste = useCallback(
        (_view, event, _slice) => {
            if (!event.clipboardData) {
                return false;
            }

            const pastedImageFiles = fileListToImageFiles(
                event.clipboardData.files,
            );
            if (pastedImageFiles.length > 0) {
                handleNewImageFiles(pastedImageFiles);
                return true;
            }

            return false;
        },
        [handleNewImageFiles],
    );

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {/* Email Header Fields */}
            <Stack spacing={2}>
                <TextField
                    fullWidth
                    label="To"
                    value={emailData.to}
                    onChange={handleEmailDataChange('to')}
                    placeholder="recipient@example.com"
                    variant="outlined"
                    size="small"
                />
                <TextField
                    fullWidth
                    label="Subject"
                    value={emailData.subject}
                    onChange={handleEmailDataChange('subject')}
                    placeholder="Enter email subject"
                    variant="outlined"
                    size="small"
                />
            </Stack>

            {/* Rich Text Editor */}
            <Box
                sx={{
                    flex: 1,
                    '& .ProseMirror': {
                        minHeight: '400px',
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            scrollMarginTop: showMenuBar ? 50 : 0,
                        },
                    },
                    '& .MuiRichTextEditor-content': {
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
            >
                <RichTextEditor
                    ref={rteRef}
                    extensions={extensions}
                    editable={isEditable}
                    editorProps={{
                        handleDrop: handleDrop,
                        handlePaste: handlePaste,
                    }}
                    renderControls={() => <EditorMenuControls />}
                    RichTextFieldProps={{
                        variant: "outlined",
                        MenuBarProps: {
                            hide: !showMenuBar,
                        },
                        footer: (
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    borderTopStyle: "solid",
                                    borderTopWidth: 1,
                                    borderTopColor: (theme) => theme.palette.divider,
                                    py: 1,
                                    px: 1.5,
                                }}
                            >
                                <MenuButton
                                    value="formatting"
                                    tooltipLabel={
                                        showMenuBar ? "Hide formatting" : "Show formatting"
                                    }
                                    size="small"
                                    onClick={() =>
                                        setShowMenuBar((currentState) => !currentState)
                                    }
                                    selected={showMenuBar}
                                    IconComponent={TextFields}
                                />

                                <MenuButton
                                    value="formatting"
                                    tooltipLabel={
                                        isEditable
                                            ? "Prevent edits (use read-only mode)"
                                            : "Allow edits"
                                    }
                                    size="small"
                                    onClick={() => setIsEditable((currentState) => !currentState)}
                                    selected={!isEditable}
                                    IconComponent={isEditable ? Lock : LockOpen}
                                />

                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        const content = rteRef.current?.editor?.getHTML() ?? "";
                                        const emailContent = {
                                            to: emailData.to,
                                            subject: emailData.subject,
                                            body: content
                                        };
                                        console.log('Email Data:', emailContent);
                                        // Handle email submission here
                                    }}
                                >
                                    Send
                                </Button>
                            </Stack>
                        ),
                    }}
                >
                    {() => (
                        <>
                            <LinkBubbleMenu />
                            <TableBubbleMenu />
                        </>
                    )}
                </RichTextEditor>
            </Box>
        </Box>
    );
}
